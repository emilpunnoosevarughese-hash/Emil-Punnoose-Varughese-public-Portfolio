import type { ImageSourceType } from '../../types/speclab';

export interface ImageCandidate {
  id: string;
  source_type: ImageSourceType;
  source_name: string;
  title: string;
  thumbnail_url: string;
  image_url: string;
  source_url: string;
  creator: string;
  license: string;
  license_url: string;
  attribution_text: string;
  dimensions?: { width: number; height: number };
}

export interface ImageSourceProvider {
  name: string;
  search(query: string, options?: { limit?: number }): Promise<ImageCandidate[]>;
}

export const WikimediaProvider: ImageSourceProvider = {
  name: 'Wikimedia Commons',
  async search(query: string, options = { limit: 12 }): Promise<ImageCandidate[]> {
    try {
      // Wikimedia Action API for searching images (namespace 6 is File)
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${options.limit}&prop=imageinfo&iiprop=url|extmetadata|dimensions&format=json&origin=*`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.query || !data.query.pages) {
        return [];
      }

      const candidates: ImageCandidate[] = [];
      const pages = Object.values(data.query.pages) as any[];

      for (const page of pages) {
        if (!page.imageinfo || !page.imageinfo[0]) continue;
        const info = page.imageinfo[0];
        const meta = info.extmetadata || {};

        const title = page.title.replace(/^File:/, '');
        const creator = meta.Artist?.value ? stripHtml(meta.Artist.value) : 'Unknown Creator';
        const license = meta.LicenseShortName?.value || 'Unknown License';
        const license_url = meta.LicenseUrl?.value || '';
        
        // Skip non-free images or logos if they somehow get in
        if (license.toLowerCase().includes('fair use') || license.toLowerCase().includes('copyrighted')) continue;

        candidates.push({
          id: `wm-${page.pageid}`,
          source_type: 'WIKIMEDIA_COMMONS',
          source_name: 'Wikimedia Commons',
          title: title,
          thumbnail_url: info.url, // Note: For a real app, you'd request iiurlwidth to get a true thumbnail
          image_url: info.url,
          source_url: info.descriptionurl,
          creator: creator,
          license: license,
          license_url: license_url,
          attribution_text: `"${title}" by ${creator} is licensed under ${license}. Source: Wikimedia Commons`,
          dimensions: {
            width: info.width,
            height: info.height
          }
        });
      }

      return candidates;
    } catch (error) {
      console.error("Wikimedia API error:", error);
      return [];
    }
  }
};

export const OpenverseProvider: ImageSourceProvider = {
  name: 'Openverse',
  async search(query: string, options = { limit: 12 }): Promise<ImageCandidate[]> {
    try {
      // Openverse provides CC-licensed images. 
      // Note: In a production app, you should register for an Openverse API token.
      const url = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(query)}&page_size=${options.limit}`;
      
      const response = await fetch(url);
      if (!response.ok) return []; // Might fail if rate limited without token
      const data = await response.json();
      
      if (!data.results) return [];

      return data.results.map((item: any) => ({
        id: `ov-${item.id}`,
        source_type: 'OPENVERSE',
        source_name: 'Openverse',
        title: item.title,
        thumbnail_url: item.thumbnail || item.url,
        image_url: item.url,
        source_url: item.foreign_landing_url,
        creator: item.creator || 'Unknown Creator',
        license: `CC ${item.license.toUpperCase()} ${item.license_version}`,
        license_url: item.license_url,
        attribution_text: `"${item.title}" by ${item.creator || 'Unknown'} is licensed under CC ${item.license.toUpperCase()} ${item.license_version}.`,
        dimensions: {
          width: item.width || 0,
          height: item.height || 0
        }
      }));
    } catch (error) {
      console.error("Openverse API error:", error);
      return [];
    }
  }
};

// Helper function to strip HTML tags returned by Wikimedia's extmetadata
function stripHtml(html: string) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
