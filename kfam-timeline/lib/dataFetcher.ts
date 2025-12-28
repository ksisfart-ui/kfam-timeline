import Papa from "papaparse";
import { ArchiveData } from "@/types";
import { NewsData } from "@/types";

export async function fetchArchiveData(url: string): Promise<ArchiveData[]> {
  if (!url) {
    console.error("CSV_URL is not defined");
    return [];
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 0 }, // 開発中はキャッシュを無効化して確認
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as ArchiveData[]);
        },
        error: (error: Error) => {
          console.error("PapaParse Error:", error);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function fetchNewsData(url: string): Promise<NewsData[]> {
  if (!url) return [];

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // 日付の降順（新しい順）に並び替えて返す
          const sorted = (results.data as NewsData[]).sort((a, b) => 
            b.日付.localeCompare(a.日付)
          );
          resolve(sorted);
        },
      });
    });
  } catch (e) {
    console.error("News Fetch Error:", e);
    return [];
  }
}
