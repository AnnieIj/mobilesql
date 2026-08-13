/**
 * Mockaroo-style Fake Data Generator Service (100 to 1,000,000 records)
 */

import { DatasetTable, DatasetColumn, MockFieldType } from '../types/dataset';

const FIRST_NAMES = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Sophia', 'William', 'Isabella', 'James', 'Mia', 'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Camila', 'Alexander', 'Gianna', 'Mason', 'Abigail', 'Michael', 'Ella', 'Ethan', 'Emily'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark'];
const DOMAINS = ['gmail.com', 'techdomain.io', 'globalcorp.de', 'cybernet.org', 'cloudscale.com', 'enterprise.co', 'acmelabs.com', 'nextgen.dev'];
const CITIES = ['New York', 'London', 'Tokyo', 'Berlin', 'San Francisco', 'Paris', 'Toronto', 'Singapore', 'Sydney', 'Amsterdam', 'Chicago', 'Dublin', 'Seoul', 'Zurich', 'Austin'];
const COUNTRIES = ['United States', 'Germany', 'United Kingdom', 'Japan', 'France', 'Canada', 'Singapore', 'Australia', 'Netherlands', 'Ireland', 'South Korea', 'Switzerland', 'Brazil', 'India'];
const COMPANIES = ['Apex Technologies', 'Vortex Systems', 'HyperScale Cloud', 'Quantum Analytics', 'AeroCorp Global', 'Nexus Networks', 'OmniData Labs', 'CyberShield Security', 'Starlight Media', 'BioGenetics Corp'];
const PRODUCTS = ['UltraBook Pro 15', 'Noise-Canceling Headphones', 'Ergonomic Mesh Chair', 'Smart 4K Monitor 32"', 'Wireless Mechanical Keyboard', 'Precision Optical Mouse', 'USB-C Docking Station 12-in-1', 'Portable SSD 2TB NVMe', 'HD Streaming Webcam', 'Studio Condenser Microphone'];
const STATUSES = ['Active', 'Pending', 'Completed', 'Processing', 'Cancelled', 'Shipped', 'Delivered', 'Flagged', 'Approved', 'Archived'];

export function generateFakeFieldValue(mockType: MockFieldType, rowIndex: number, colName: string): unknown {
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  switch (mockType) {
    case 'fullName':
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    case 'firstName':
      return pick(FIRST_NAMES);
    case 'lastName':
      return pick(LAST_NAMES);
    case 'email':
      return `${pick(FIRST_NAMES).toLowerCase()}.${pick(LAST_NAMES).toLowerCase()}${randInt(10, 99)}@${pick(DOMAINS)}`;
    case 'phone':
      return `+1 (${randInt(200, 999)}) ${randInt(100, 999)}-${randInt(1000, 9999)}`;
    case 'address':
      return `${randInt(100, 9999)} ${pick(['Main St', 'Market Ave', 'Broadway', '5th Ave', 'Park Rd', 'Oak St', 'Washington Blvd'])}`;
    case 'city':
      return pick(CITIES);
    case 'country':
      return pick(COUNTRIES);
    case 'companyName':
      return pick(COMPANIES);
    case 'productName':
      return pick(PRODUCTS);
    case 'invoiceNumber':
      return `INV-${2026}-${String(rowIndex + 1000).padStart(6, '0')}`;
    case 'price':
      return Number((randInt(10, 1500) + Math.random()).toFixed(2));
    case 'amount':
      return Number((randInt(50, 25000) + Math.random()).toFixed(2));
    case 'salary':
      return randInt(45000, 220000);
    case 'medicalCode':
      return `ICD10-${pick(['A00', 'B20', 'C34', 'E11', 'I10', 'J45', 'M54'])}.${randInt(1, 9)}`;
    case 'timestamp': {
      const d = new Date(Date.now() - randInt(0, 365 * 24 * 3600 * 1000));
      return d.toISOString().replace('T', ' ').substring(0, 19);
    }
    case 'uuid':
      return `usr_${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}`;
    case 'jsonField':
      return { device: pick(['Desktop', 'iOS', 'Android']), ip: `192.168.${randInt(1, 254)}.${randInt(1, 254)}`, sessionMinutes: randInt(1, 120) };
    case 'creditCard':
      return `4532-****-****-${randInt(1000, 9999)}`;
    case 'statusEnum':
      return pick(STATUSES);
    case 'boolean':
      return Math.random() > 0.3;
    case 'integer':
    default:
      if (colName.includes('id')) return rowIndex + 1;
      return randInt(1, 10000);
  }
}

export function generateTableMockRows(table: DatasetTable, count: number): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const limit = Math.min(count, 1000); // Generate up to 1000 preview rows instantly

  for (let i = 0; i < limit; i++) {
    const row: Record<string, unknown> = {};
    table.columns.forEach((col) => {
      row[col.name] = generateFakeFieldValue(col.mockGeneratorType, i, col.name);
    });
    rows.push(row);
  }

  return rows;
}
