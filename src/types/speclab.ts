// SpecLab — Hardware Intelligence Platform
// TypeScript interfaces for all hardware categories

export type HardwareCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'laptop'
  | 'psu'
  | 'cooler'
  | 'case'
  | 'display'
  | 'networking';

export type CompatibilityStatus = 'compatible' | 'warning' | 'incompatible' | 'unknown';

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  official_url?: string;
}

export type ImageSourceType = 
  | 'WIKIMEDIA_COMMONS'
  | 'OPENVERSE'
  | 'LICENSED_SOURCE'
  | 'OWN_PHOTO'
  | 'PERMISSION_GRANTED'
  | 'ORIGINAL_GRAPHIC'
  | 'MANUFACTURER_WITH_PERMISSION'
  | 'OTHER_APPROVED_SOURCE'
  | 'PLACEHOLDER';

export interface HardwareImage {
  id?: string;
  url: string;
  storage_path?: string;
  source_type: ImageSourceType;
  source_name?: string;
  source_url?: string;
  creator?: string;
  license?: string;
  license_url?: string;
  attribution_text?: string;
  permission_reference?: string;
  is_original?: boolean;
  is_verified: boolean;
  verification_status?: 'pending' | 'verified' | 'rejected' | 'needs_review' | 'expired_or_unavailable';
  verified_by?: string;
  verified_at?: string;
  alt_text: string;
}

export interface HardwareProduct {
  id: string;
  manufacturer_id: string;
  manufacturer_name: string;
  category: HardwareCategory;
  name: string;           // Full display name, e.g. "Core i5-13600K"
  model_number?: string;  // Official model number
  slug: string;           // URL-safe, e.g. "intel-core-i5-13600k"
  price_inr?: number;     // Optional price for the Custom Builder
  image?: HardwareImage;  // Legacy field, keeping for backwards compatibility
  primary_image?: HardwareImage;
  gallery_images?: HardwareImage[];
  description?: string;
  release_date?: string;  // ISO date string, e.g. "2022-10-20"
  verified: boolean;      // Admin-confirmed data accuracy
  verification_status?: VerificationStatus;
  category_id?: string;
  source_url?: string;    // URL to official spec sheet
  tags?: string[];
  features?: string[];    // "abilities" or key selling points
  game_support?: string;  // e.g. "720p Low in modern esports", "4K Ultra"
  windows_support?: string; // e.g. "Windows 10, 11", "Windows 7, 8.1"
  linux_support?: string;   // e.g. "Ubuntu 22.04 LTS"
}

// ─── CPU ────────────────────────────────────────────────────────────────────
export interface CpuSpec {
  product_id: string;
  socket: string;              // e.g. "LGA1700", "AM5"
  architecture: string;        // e.g. "Raptor Lake", "Zen 4"
  cores: number;
  threads: number;
  performance_cores?: number;  // Intel hybrid architecture
  efficiency_cores?: number;
  base_ghz: number;
  boost_ghz: number;
  l2_cache_mb?: number;
  l3_cache_mb: number;
  tdp_w: number;
  max_tdp_w?: number;          // Turbo Power / PBP
  integrated_graphics?: string;// e.g. "Intel UHD 770", null if none
  memory_type: string[];       // e.g. ["DDR4", "DDR5"]
  max_memory_gb: number;
  memory_channels: number;
  pcie_version: string;        // e.g. "5.0"
  pcie_lanes: number;
  lithography_nm?: number;
  launch_price_usd?: null;     // Never shown, always null
  benchmark_score?: number;    // Score used to evaluate performance
}

// ─── GPU ────────────────────────────────────────────────────────────────────
export interface GpuSpec {
  product_id: string;
  architecture: string;        // e.g. "Ada Lovelace", "RDNA 3"
  gpu_chip?: string;           // e.g. "AD102", "Navi 31"
  vram_gb: number;
  vram_type: string;           // e.g. "GDDR6X", "GDDR6"
  vram_bus_bits?: number;
  tdp_w: number;
  pcie_slot: string;           // e.g. "PCIe 4.0 x16"
  length_mm?: number;
  width_slots?: number;        // e.g. 2 for dual-slot, 3 for triple
  power_connectors: string[];  // e.g. ["16-pin"], ["8-pin", "8-pin"]
  outputs: string[];           // e.g. ["HDMI 2.1", "3x DisplayPort 1.4a"]
  lithography_nm?: number;
  cuda_cores?: number;
  stream_processors?: number;
  benchmark_score?: number;    // Score used to evaluate performance
}

// ─── Motherboard ─────────────────────────────────────────────────────────────
export interface MotherboardSpec {
  product_id: string;
  socket: string;
  chipset: string;             // e.g. "Z790", "B650"
  form_factor: string;         // e.g. "ATX", "mATX", "ITX"
  ram_type: string[];          // e.g. ["DDR5"] or ["DDR4"]
  ram_slots: number;
  max_ram_gb: number;
  max_ram_speed_mhz?: number;
  pcie_x16_slots: number;
  pcie_x1_slots?: number;
  m2_slots: number;
  m2_details?: string[];       // e.g. ["PCIe 5.0 x4", "PCIe 4.0 x4"]
  sata_ports: number;
  usb_ports?: string[];
  has_wifi?: boolean;
  has_bluetooth?: boolean;
  lan_speed?: string;          // e.g. "2.5 GbE"
  audio_chipset?: string;
}

// ─── RAM ─────────────────────────────────────────────────────────────────────
export interface RamSpec {
  product_id: string;
  type: string;                // e.g. "DDR5", "DDR4"
  speed_mhz: number;           // e.g. 5600
  capacity_gb: number;         // Per kit
  kit_count: number;           // e.g. 2 (2x16GB kit)
  cas_latency?: number;
  voltage?: number;
  form_factor: string;         // "DIMM", "SO-DIMM"
  ecc?: boolean;
}

// ─── Storage ─────────────────────────────────────────────────────────────────
export interface StorageSpec {
  product_id: string;
  type: string;                // "NVMe SSD", "SATA SSD", "HDD"
  interface: string;           // e.g. "PCIe 4.0 x4", "SATA III"
  form_factor: string;         // "M.2 2280", "2.5\"", "3.5\""
  capacity_gb: number;
  sequential_read_mbps?: number;
  sequential_write_mbps?: number;
  nand_type?: string;          // "TLC", "QLC", "MLC"
  controller?: string;
  cache?: string;
  rpm?: number;                // For HDDs only
  warranty_years?: number;
}

// ─── Laptop ──────────────────────────────────────────────────────────────────
export interface LaptopSpec {
  product_id: string;
  cpu_name: string;
  gpu_name: string;
  gpu_type: 'integrated' | 'discrete' | 'both';
  ram_gb: number;
  max_ram_gb?: number;
  ram_upgradeable?: boolean;
  ram_type?: string;
  storage_gb: number;
  additional_storage_slot?: boolean;
  display_inches: number;
  resolution: string;          // e.g. "2560x1664"
  refresh_hz: number;
  panel_type?: string;         // e.g. "OLED", "IPS"
  ports: string[];
  wifi_standard?: string;      // e.g. "Wi-Fi 6E"
  bluetooth?: string;          // e.g. "5.3"
  battery_wh?: number;
  weight_kg?: number;
  os?: string;
  upgrade_notes?: string;
}

// ─── PSU ─────────────────────────────────────────────────────────────────────
export interface PsuSpec {
  product_id: string;
  wattage: number;
  efficiency_rating: string;   // "80+ Bronze", "80+ Gold", "80+ Platinum"
  modular: 'full' | 'semi' | 'non';
  form_factor: string;         // "ATX", "SFX"
  atx_version?: string;        // e.g. "3.0"
  connectors?: string[];
}

// ─── Cooler ──────────────────────────────────────────────────────────────────
export interface CoolerSpec {
  product_id: string;
  type: 'air' | 'aio' | 'custom';
  radiator_size_mm?: number;   // For AIO: 240, 280, 360
  compatible_sockets: string[];// e.g. ["LGA1700", "AM5", "AM4"]
  fan_size_mm?: number;
  max_tdp_w?: number;
  height_mm?: number;          // For air coolers (clearance check)
  noise_dba?: number;
}

// ─── Case ────────────────────────────────────────────────────────────────────
export interface CaseSpec {
  product_id: string;
  form_factor: string;         // e.g. "Mid Tower", "Mini ITX"
  motherboard_support: string[]; // e.g. ["ATX", "Micro ATX", "Mini ITX"]
  max_gpu_length_mm?: number;
  max_cooler_height_mm?: number;
  included_fans?: number;
  front_panel_usb?: string[];
}

// ─── Compatibility ────────────────────────────────────────────────────────────
export interface CompatibilityRule {
  id: string;
  rule_type: 'socket' | 'memory' | 'pcie' | 'form_factor' | 'power' | 'clearance' | 'chipset';
  component_a_id: string;
  component_a_category: HardwareCategory;
  component_b_id: string;
  component_b_category: HardwareCategory;
  status: CompatibilityStatus;
  explanation: string;         // Plain-English description
}

export interface CompatibilityCheckResult {
  status: CompatibilityStatus;
  issues: Array<{
    rule_type: string;
    status: CompatibilityStatus;
    explanation: string;
    component_a: string;
    component_b: string;
  }>;
}

// ─── Build Advisor ────────────────────────────────────────────────────────────
export type BuildPurpose =
  | 'gaming'
  | 'programming'
  | 'web_development'
  | 'ai_ml'
  | 'video_editing'
  | '3d_rendering'
  | 'cybersecurity'
  | 'general_use'
  | 'student';

export interface BuildPreferences {
  purpose: BuildPurpose;
  form_factor?: 'desktop' | 'laptop';
  cpu_brand?: 'intel' | 'amd' | 'any';
  gpu_brand?: 'nvidia' | 'amd' | 'any';
  ram_target_gb?: number;
  storage_target_gb?: number;
}

export interface RecommendedBuild {
  purpose: BuildPurpose;
  label: string;
  description: string;
  components: Array<{
    category: HardwareCategory;
    product: HardwareProduct;
    reasoning: string;
  }>;
  compatibility: CompatibilityCheckResult;
}

// ─── Search ───────────────────────────────────────────────────────────────────
export interface HardwareSearchFilters {
  query?: string;
  category?: HardwareCategory;
  manufacturer?: string;
  verified_only?: boolean;
  sort_by?: 'name' | 'release_date' | 'manufacturer';
  sort_dir?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

// ─── Connector types (for ConnectorExplorer) ──────────────────────────────────
export interface ConnectorInfo {
  id: string;
  name: string;
  slug: string;
  category: 'usb' | 'video' | 'storage' | 'network' | 'power' | 'other';
  description: string;
  use_cases: string[];
  versions: Array<{
    name: string;
    speed?: string;
    power?: string;
    notes?: string;
  }>;
  common_misconceptions?: string[];
  compatibility_notes?: string[];
}

// ─── Provenance & Sourcing ───────────────────────────────────────────────────

export type SourceType =
  | 'Manufacturer Product Page'
  | 'Manufacturer Datasheet'
  | 'Manufacturer Manual'
  | 'Manufacturer Support Page'
  | 'Official Documentation'
  | 'Licensed Dataset'
  | 'Wikimedia Commons'
  | 'Own Photograph'
  | 'Permission Granted'
  | 'Secondary Source'
  | 'Other';

export type VerificationStatus = 'draft' | 'under_review' | 'verified' | 'published' | 'needs_review';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface SpecLabSource {
  id: string;
  source_name: string;
  source_type: SourceType;
  publisher: string;
  url: string;
  license: string;
  license_url?: string;
  accessed_at: string;
  notes?: string;
  status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface SpecLabSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  unit?: string;
  source_id?: string;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  confidence: ConfidenceLevel;
  notes?: string;
}

export interface SpecLabImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path?: string;
  source_id?: string;
  source_url?: string;
  creator?: string;
  license?: string;
  license_url?: string;
  attribution_text?: string;
  permission_reference?: string;
  is_original: boolean;
  is_verified: boolean;
  verified_at?: string;
  alt_text: string;
  status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface SpecLabCompatibility {
  id: string;
  product_a_id: string;
  product_b_id: string;
  relationship_type: string;
  status: CompatibilityStatus;
  source_id?: string;
  confidence: ConfidenceLevel;
  reason: string;
  verified: boolean;
  verified_at?: string;
  notes?: string;
}

export interface CorrectionReport {
  id: string;
  product_id: string;
  report_type: 'Incorrect spec' | 'Incorrect image' | 'Incorrect compatibility' | 'Missing spec' | 'Outdated' | 'Other';
  description: string;
  reported_by_email?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface AuditLogEntry {
  id: string;
  product_id?: string;
  changed_by: string; // admin user ID
  action: 'create' | 'update' | 'delete' | 'verify' | 'reject';
  field_name?: string;
  old_value?: any;
  new_value?: any;
  source_id?: string;
  timestamp: string;
  notes?: string;
}

export interface SourceMonitor {
  id: string;
  source_id: string;
  source_url: string;
  last_checked: string;
  last_ok: boolean;
  status: 'healthy' | 'unreachable' | 'redirected' | 'unknown';
  notes?: string;
}

export interface PrebuiltSystem {
  id: string;
  tier: string;
  price_inr: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  motherboard: string;
  power_supply: string;
  case: string;
  performance_desc: string;
  recommended_os: string;
}
