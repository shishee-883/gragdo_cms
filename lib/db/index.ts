import "server-only";
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

// Define the base path for data files
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure the data directory exists
export async function ensureDataDir(): Promise<void> {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic function to read data from a JSON file
export async function readData<T>(collection: string, defaultValue: T[] = []): Promise<T[]> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading from ${collection}.json:`, error);
    return defaultValue;
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(collection: string, data: T[]): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing to ${collection}.json:`, error);
    throw new Error(`Failed to write data to ${collection}`);
  }
}

// Function to find a record by ID
export async function findById<T extends { id: string }>(
  collection: string,
  id: string
): Promise<T | null> {
  try {
    const data = await readData<T>(collection, []);
    return data.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error finding record by ID in ${collection}.json:`, error);
    return null;
  }
}

// Function to get related data with proper typing
export async function getRelatedData<T, R>(
  collection: string,
  foreignKey: keyof T,
  foreignValue: string,
  defaultValue: R[] = []
): Promise<R[]> {
  try {
    const data = await readData<T>(collection, []);
    return data.filter(item => item[foreignKey] === foreignValue) as unknown as R[];
  } catch (error) {
    console.error(`Error getting related data from ${collection}.json:`, error);
    return defaultValue;
  }
}

// Function to create a new record
export async function createRecord<T extends { id: string }>(
  collection: string,
  data: Omit<T, 'id'>
): Promise<T> {
  try {
    const records = await readData<T>(collection, []);
    
    // Generate a unique ID if not provided
    const newRecord = {
      id: nanoid(),
      ...data,
    } as T;
    
    records.push(newRecord);
    await writeData(collection, records);
    
    return newRecord;
  } catch (error) {
    console.error(`Error creating record in ${collection}.json:`, error);
    throw new Error(`Failed to create record in ${collection}`);
  }
}

// Function to update a record
export async function updateRecord<T extends { id: string }>(
  collection: string,
  id: string,
  data: Partial<T>
): Promise<T | null> {
  try {
    const records = await readData<T>(collection, []);
    const index = records.findIndex(record => record.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedRecord = {
      ...records[index],
      ...data,
    };
    
    records[index] = updatedRecord;
    await writeData(collection, records);
    
    return updatedRecord;
  } catch (error) {
    console.error(`Error updating record in ${collection}.json:`, error);
    throw new Error(`Failed to update record in ${collection}`);
  }
}

// Function to delete a record
export async function deleteRecord<T extends { id: string }>(
  collection: string,
  id: string
): Promise<boolean> {
  try {
    const records = await readData<T>(collection, []);
    const filteredRecords = records.filter(record => record.id !== id);
    
    if (filteredRecords.length === records.length) {
      return false; // Record not found
    }
    
    await writeData(collection, filteredRecords);
    return true;
  } catch (error) {
    console.error(`Error deleting record from ${collection}.json:`, error);
    throw new Error(`Failed to delete record from ${collection}`);
  }
}

// Function to generate a unique ID with a prefix
export function generateId(prefix: string, length: number = 6): string {
  const randomPart = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  return `${prefix}${randomPart}`;
}