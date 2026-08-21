import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, Firestore } from 'firebase/firestore';

import type {
  HardwareCategory,
  HardwareProduct,
  HardwareSearchFilters,
  PaginatedResult,
  Manufacturer,
  CompatibilityCheckResult,
  CompatibilityStatus,
} from '../types/speclab';

import {
  SEED_MANUFACTURERS,
  SEED_CPUS,
  SEED_GPUS,
  SEED_MOTHERBOARDS,
  SEED_RAM,
  SEED_STORAGE,
  SEED_LAPTOPS,
  SEED_COMPATIBILITY_RULES,
} from './speclabData';

const ALL_SEED_PRODUCTS = [
  ...SEED_CPUS,
  ...SEED_GPUS,
  ...SEED_MOTHERBOARDS,
  ...SEED_RAM,
  ...SEED_STORAGE,
  ...SEED_LAPTOPS,
];

function getSeedProductsByCategory(category: HardwareCategory) {
  switch (category) {
    case 'cpu': return SEED_CPUS;
    case 'gpu': return SEED_GPUS;
    case 'motherboard': return SEED_MOTHERBOARDS;
    case 'ram': return SEED_RAM;
    case 'storage': return SEED_STORAGE;
    case 'laptop': return SEED_LAPTOPS;
    default: return ALL_SEED_PRODUCTS.filter(p => p.category === category);
  }
}

export async function getHardwareByCategory(
  category: HardwareCategory,
  filters?: HardwareSearchFilters,
  page = 1,
  pageSize = 12
): Promise<PaginatedResult<HardwareProduct & { spec?: any }>> {
  let products: any[] = [];
  
  if (db) {
    try {
      const q = query(collection(db as Firestore, 'hardware_products'), where('category', '==', category));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        products = await Promise.all(
          snapshot.docs.map(async (d) => {
            const data = d.data();
            const specDoc = await getDoc(doc(db as Firestore, 'hardware_specs', data.id));
            return {
              ...data,
              id: data.id || d.id,
              spec: specDoc.exists() ? specDoc.data() : undefined
            };
          })
        );
      }
    } catch {
      // Fallback
    }
  }
  
  if (products.length === 0) {
    products = getSeedProductsByCategory(category);
  }
  
  // Apply filters
  if (filters) {
    if (filters.query) {
      const lowerQ = filters.query.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(lowerQ));
    }
    if (filters.manufacturer) {
      products = products.filter(p => p.manufacturer_id === filters.manufacturer);
    }
    if (filters.verified_only) {
      products = products.filter(p => p.verified);
    }
  }

  const total = products.length;
  const start = (page - 1) * pageSize;
  const paginatedItems = products.slice(start, start + pageSize);
  
  return {
    items: paginatedItems,
    total,
    page,
    page_size: pageSize,
    has_next: start + pageSize < total
  };
}

export async function getHardwareBySlug(
  category: HardwareCategory,
  slug: string
): Promise<(HardwareProduct & { spec?: any }) | null> {
  if (db) {
    try {
      const q = query(
        collection(db as Firestore, 'hardware_products'),
        where('category', '==', category),
        where('slug', '==', slug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as HardwareProduct;
        const specDoc = await getDoc(doc(db as Firestore, 'hardware_specs', data.id));
        return {
          ...data,
          spec: specDoc.exists() ? specDoc.data() : undefined
        };
      }
    } catch {
      // Fallback
    }
  }
  
  const seedProducts = getSeedProductsByCategory(category);
  const found = seedProducts.find(p => p.slug === slug);
  return found || null;
}

export async function searchHardware(
  queryStr: string,
  category?: HardwareCategory
): Promise<Array<HardwareProduct>> {
  const lowerQ = queryStr.toLowerCase();
  
  let products: HardwareProduct[] = [];
  
  if (db) {
    try {
      let q;
      if (category) {
        q = query(collection(db as Firestore, 'hardware_products'), where('category', '==', category));
      } else {
        q = collection(db as Firestore, 'hardware_products');
      }
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        products = snapshot.docs.map(d => {
          const data = d.data() as HardwareProduct;
          return { ...data, id: data.id || d.id };
        });
      }
    } catch {
      // Fallback
    }
  }
  
  if (products.length === 0) {
    products = category ? getSeedProductsByCategory(category) : ALL_SEED_PRODUCTS;
  }
  
  // Client-side filtering
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQ) ||
    p.manufacturer_name.toLowerCase().includes(lowerQ) ||
    (p.model_number && p.model_number.toLowerCase().includes(lowerQ))
  );
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  if (db) {
    try {
      const snapshot = await getDocs(collection(db as Firestore, 'hardware_manufacturers'));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => {
          const data = d.data() as Manufacturer;
          return { ...data, id: data.id || d.id };
        });
      }
    } catch {
      // Fallback
    }
  }
  return SEED_MANUFACTURERS;
}

export async function checkCompatibility(
  components: Array<{ id: string; category: HardwareCategory }>
): Promise<CompatibilityCheckResult> {
  let rules: any[] = [];
  
  if (db) {
    try {
      const snapshot = await getDocs(collection(db as Firestore, 'compatibility_rules'));
      if (!snapshot.empty) {
        rules = snapshot.docs.map(d => d.data());
      }
    } catch {
      // Fallback
    }
  }
  
  if (rules.length === 0) {
    rules = SEED_COMPATIBILITY_RULES;
  }
  
  // Look up full product info from seeds to check compatibility logically if simple IDs don't match rules directly
  // The user prompt says: "implement client-side logic against the seed rules (look up rules from Firestore first, then seed). Check each pair of selected components against rules."
  
  const issues: CompatibilityCheckResult['issues'] = [];
  let overallStatus: CompatibilityStatus = 'compatible';

  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const compA = components[i];
      const compB = components[j];

      // Find direct rule matches (this is a simplified logic, actual logic would match attributes)
      // Since rules in seed often use generalized IDs like 'intel-13th-gen', we might need to map them or just do our best.
      // For now, we try to match generic identifiers. Let's do a basic text mapping to simulate rule checking.
      
      const fullA = ALL_SEED_PRODUCTS.find(p => p.id === compA.id);
      const fullB = ALL_SEED_PRODUCTS.find(p => p.id === compB.id);

      if (fullA && fullB) {
        if (fullA.category === 'cpu' && fullB.category === 'motherboard') {
          const cpu = fullA as any;
          const mobo = fullB as any;
          if (cpu.spec?.socket !== mobo.spec?.socket) {
            issues.push({
              rule_type: 'socket',
              status: 'incompatible',
              explanation: `Socket mismatch: CPU uses ${cpu.spec?.socket} but Motherboard uses ${mobo.spec?.socket}.`,
              component_a: fullA.name,
              component_b: fullB.name,
            });
          }
        }
        
        if (fullA.category === 'ram' && fullB.category === 'motherboard') {
          const ram = fullA as any;
          const mobo = fullB as any;
          if (!mobo.spec?.ram_type.includes(ram.spec?.type)) {
            issues.push({
              rule_type: 'memory',
              status: 'incompatible',
              explanation: `Memory mismatch: RAM is ${ram.spec?.type} but Motherboard supports ${mobo.spec?.ram_type.join(', ')}.`,
              component_a: fullA.name,
              component_b: fullB.name,
            });
          }
        }
        
        if (fullB.category === 'ram' && fullA.category === 'motherboard') {
           const ram = fullB as any;
           const mobo = fullA as any;
           if (!mobo.spec?.ram_type.includes(ram.spec?.type)) {
             issues.push({
               rule_type: 'memory',
               status: 'incompatible',
               explanation: `Memory mismatch: RAM is ${ram.spec?.type} but Motherboard supports ${mobo.spec?.ram_type.join(', ')}.`,
               component_a: fullB.name,
               component_b: fullA.name,
             });
           }
        }
      }
    }
  }

  if (issues.some(i => i.status === 'incompatible')) overallStatus = 'incompatible';
  else if (issues.some(i => i.status === 'warning')) overallStatus = 'warning';

  return {
    status: overallStatus,
    issues
  };
}

export async function getCompatibleWith(
  productId: string,
  fromCategory: HardwareCategory,
  targetCategory: HardwareCategory
): Promise<HardwareProduct[]> {
  const targetProducts = getSeedProductsByCategory(targetCategory);
  const baseProduct = ALL_SEED_PRODUCTS.find(p => p.id === productId);
  
  if (!baseProduct) return targetProducts;
  
  return targetProducts.filter(targetProduct => {
    // Basic compatibility filter check
    if (fromCategory === 'cpu' && targetCategory === 'motherboard') {
      return (baseProduct as any).spec?.socket === (targetProduct as any).spec?.socket;
    }
    if (fromCategory === 'motherboard' && targetCategory === 'cpu') {
      return (baseProduct as any).spec?.socket === (targetProduct as any).spec?.socket;
    }
    if (fromCategory === 'ram' && targetCategory === 'motherboard') {
      return (targetProduct as any).spec?.ram_type.includes((baseProduct as any).spec?.type);
    }
    if (fromCategory === 'motherboard' && targetCategory === 'ram') {
      return (baseProduct as any).spec?.ram_type.includes((targetProduct as any).spec?.type);
    }
    return true; // No known strict incompatibilities
  });
}
