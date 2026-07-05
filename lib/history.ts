import localforage from "localforage";
import { IdentifyResult } from "@/types/animal";

export interface HistoryRecord {
  id: string; // e.g. timestamp as string
  timestamp: number;
  imageBlob: Blob;
  result: IdentifyResult;
  isSaved: boolean;
}

const db = localforage.createInstance({
  name: "FaunafyDB",
  storeName: "historyStore",
});

export async function addHistoryRecord(imageBlob: Blob, result: IdentifyResult): Promise<string> {
  const timestamp = Date.now();
  const id = timestamp.toString();
  
  const record: HistoryRecord = {
    id,
    timestamp,
    imageBlob,
    result,
    isSaved: false,
  };

  await db.setItem(id, record);
  return id;
}

export async function getAllHistoryRecords(): Promise<HistoryRecord[]> {
  const records: HistoryRecord[] = [];
  await db.iterate((value: HistoryRecord) => {
    records.push(value);
  });
  // Sort by newest first
  return records.sort((a, b) => b.timestamp - a.timestamp);
}

export async function toggleSaveStatus(id: string): Promise<HistoryRecord | null> {
  const record: HistoryRecord | null = await db.getItem(id);
  if (!record) return null;

  record.isSaved = !record.isSaved;
  await db.setItem(id, record);
  return record;
}

export async function deleteHistoryRecord(id: string): Promise<void> {
  await db.removeItem(id);
}
