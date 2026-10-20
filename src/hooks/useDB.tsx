import React, { useState, useEffect } from 'react';
import { initDB } from '../storage/db';

export function useDB<T>() {
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    initDB().then(setDb);
  }, []);

  return db;
}

export async function getItems<T>(db: any, storeName: string): Promise<T[]> {
  return await db.getAll(storeName);
}

export async function putItem<T>(db: any, storeName: string, item: T): Promise<void> {
  await db.put(storeName, item);
}
