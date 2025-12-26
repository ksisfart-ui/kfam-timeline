import Papa from "papaparse";
import { ArchiveData } from "@/types";

export async function fetchArchiveData(url: string): Promise<ArchiveData[]> {
  const response = await fetch(url, { next: { revalidate: 300 } }); // 5分キャッシュ
  const csvText = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as ArchiveData[]);
      },
    });
  });
}
