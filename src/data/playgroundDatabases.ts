import type { SQLDialect, TableSchema } from '../types';

export interface PracticeDatabase {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  dialect: SQLDialect;
  tables: TableSchema[];
  data: Record<string, Record<string, unknown>[]>;
}

export const PRACTICE_DATABASES: PracticeDatabase[] = [
  {
    id: 'ecommerce_prod',
    name: 'E-Commerce Global Store',
    category: 'Retail & FinTech',
    description: 'Orders, users, products, line items, and region delivery tracking.',
    iconName: 'ShoppingCart',
    dialect: 'PostgreSQL',
    tables: [
      {
        name: 'customers',
        rowCount: 1250,
        columns: [
          { name: 'id', type: 'UUID', isPrimaryKey: true },
          { name: 'first_name', type: 'VARCHAR(50)' },
          { name: 'last_name', type: 'VARCHAR(50)' },
          { name: 'email', type: 'VARCHAR(100)' },
          { name: 'country', type: 'VARCHAR(50)' },
          { name: 'tier', type: 'VARCHAR(20)' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
      {
        name: 'orders',
        rowCount: 4580,
        columns: [
          { name: 'id', type: 'BIGINT', isPrimaryKey: true },
          { name: 'customer_id', type: 'UUID', isForeignKey: true, references: 'customers.id' },
          { name: 'status', type: 'VARCHAR(20)' },
          { name: 'total_amount', type: 'DECIMAL(10,2)' },
          { name: 'shipping_fee', type: 'DECIMAL(6,2)' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
      {
        name: 'order_items',
        rowCount: 12400,
        columns: [
          { name: 'id', type: 'BIGINT', isPrimaryKey: true },
          { name: 'order_id', type: 'BIGINT', isForeignKey: true, references: 'orders.id' },
          { name: 'product_id', type: 'INT', isForeignKey: true, references: 'products.id' },
          { name: 'quantity', type: 'INT' },
          { name: 'unit_price', type: 'DECIMAL(10,2)' },
        ],
      },
      {
        name: 'products',
        rowCount: 320,
        columns: [
          { name: 'id', type: 'INT', isPrimaryKey: true },
          { name: 'title', type: 'VARCHAR(150)' },
          { name: 'category', type: 'VARCHAR(50)' },
          { name: 'price', type: 'DECIMAL(10,2)' },
          { name: 'stock_quantity', type: 'INT' },
          { name: 'rating', type: 'DECIMAL(3,2)' },
        ],
      },
    ],
    data: {
      customers: [
        { id: 'usr-101', first_name: 'Elena', last_name: 'Rostova', email: 'elena@techcorp.io', country: 'Germany', tier: 'VIP', created_at: '2025-01-15 08:30:00' },
        { id: 'usr-102', first_name: 'Marcus', last_name: 'Vance', email: 'mvance@data.net', country: 'United States', tier: 'Standard', created_at: '2025-02-01 11:15:00' },
        { id: 'usr-103', first_name: 'Aisha', last_name: 'Khan', email: 'aisha@cloud.co', country: 'United Kingdom', tier: 'VIP', created_at: '2025-02-10 14:22:00' },
        { id: 'usr-104', first_name: 'Kenji', last_name: 'Sato', email: 'kenji@tokyo.jp', country: 'Japan', tier: 'Enterprise', created_at: '2025-03-05 09:10:00' },
        { id: 'usr-105', first_name: 'David', last_name: 'Kim', email: 'dkim@seoul.kr', country: 'South Korea', tier: 'Standard', created_at: '2025-03-12 16:45:00' },
      ],
      orders: [
        { id: 9001, customer_id: 'usr-101', status: 'completed', total_amount: 1450.00, shipping_fee: 15.00, created_at: '2026-08-01 10:12:00' },
        { id: 9002, customer_id: 'usr-103', status: 'completed', total_amount: 890.50, shipping_fee: 0.00, created_at: '2026-08-02 14:30:00' },
        { id: 9003, customer_id: 'usr-102', status: 'pending', total_amount: 120.25, shipping_fee: 5.99, created_at: '2026-08-05 18:05:00' },
        { id: 9004, customer_id: 'usr-104', status: 'completed', total_amount: 3420.00, shipping_fee: 25.00, created_at: '2026-08-08 09:00:00' },
        { id: 9005, customer_id: 'usr-101', status: 'refunded', total_amount: 210.00, shipping_fee: 0.00, created_at: '2026-08-10 11:40:00' },
      ],
      products: [
        { id: 1, title: 'Ultra-Fast NVMe Database Accelerator 2TB', category: 'Hardware', price: 299.99, stock_quantity: 45, rating: 4.9 },
        { id: 2, title: 'Ergonomic Developer Keyboard Pro', category: 'Accessories', price: 189.50, stock_quantity: 120, rating: 4.8 },
        { id: 3, title: '4K Curved Monitor 32-inch', category: 'Monitors', price: 649.00, stock_quantity: 18, rating: 4.7 },
        { id: 4, title: 'PostgreSQL Architecture Reference Manual', category: 'Books', price: 49.99, stock_quantity: 300, rating: 5.0 },
      ],
    },
  },
  {
    id: 'employees_corp',
    name: 'TechCorp HR & Payroll',
    category: 'Enterprise HR',
    description: 'Departments, salaries, manager hierarchies, and performance evaluations.',
    iconName: 'Users',
    dialect: 'PostgreSQL',
    tables: [
      {
        name: 'employees',
        rowCount: 850,
        columns: [
          { name: 'id', type: 'INT', isPrimaryKey: true },
          { name: 'name', type: 'VARCHAR(100)' },
          { name: 'role', type: 'VARCHAR(60)' },
          { name: 'dept_id', type: 'INT', isForeignKey: true, references: 'departments.id' },
          { name: 'manager_id', type: 'INT', isForeignKey: true, references: 'employees.id' },
          { name: 'salary', type: 'DECIMAL(12,2)' },
          { name: 'hire_date', type: 'DATE' },
        ],
      },
      {
        name: 'departments',
        rowCount: 12,
        columns: [
          { name: 'id', type: 'INT', isPrimaryKey: true },
          { name: 'name', type: 'VARCHAR(50)' },
          { name: 'budget', type: 'DECIMAL(14,2)' },
          { name: 'location', type: 'VARCHAR(50)' },
        ],
      },
      {
        name: 'salaries',
        rowCount: 3400,
        columns: [
          { name: 'emp_id', type: 'INT', isForeignKey: true, references: 'employees.id' },
          { name: 'salary', type: 'DECIMAL(12,2)' },
          { name: 'from_date', type: 'DATE' },
          { name: 'to_date', type: 'DATE' },
        ],
      },
    ],
    data: {
      employees: [
        { id: 101, name: 'Sarah Chen', role: 'VP of Engineering', dept_id: 1, manager_id: null, salary: 240000.00, hire_date: '2020-03-15' },
        { id: 102, name: 'Alex Quan', role: 'Staff Database Architect', dept_id: 1, manager_id: 101, salary: 185000.00, hire_date: '2021-06-01' },
        { id: 103, name: 'David Miller', role: 'Senior Backend Engineer', dept_id: 1, manager_id: 102, salary: 155000.00, hire_date: '2022-01-10' },
        { id: 104, name: 'Maria Santos', role: 'Lead Data Scientist', dept_id: 2, manager_id: 101, salary: 170000.00, hire_date: '2021-11-20' },
        { id: 105, name: 'James Wilson', role: 'HR Operations Director', dept_id: 3, manager_id: null, salary: 140000.00, hire_date: '2019-08-12' },
      ],
      departments: [
        { id: 1, name: 'Engineering', budget: 5000000.00, location: 'San Francisco' },
        { id: 2, name: 'Data & AI', budget: 3500000.00, location: 'New York' },
        { id: 3, name: 'Human Resources', budget: 1200000.00, location: 'Austin' },
        { id: 4, name: 'Product Design', budget: 2000000.00, location: 'London' },
      ],
    },
  },
  {
    id: 'netflix_db',
    name: 'StreamFlix Media Catalog',
    category: 'Entertainment',
    description: 'Movies, TV shows, actors, view counts, ratings, and user streaming history.',
    iconName: 'Tv',
    dialect: 'SQLite',
    tables: [
      {
        name: 'titles',
        rowCount: 6200,
        columns: [
          { name: 'id', type: 'INT', isPrimaryKey: true },
          { name: 'title', type: 'TEXT' },
          { name: 'type', type: 'TEXT' },
          { name: 'release_year', type: 'INTEGER' },
          { name: 'rating', type: 'REAL' },
          { name: 'duration_mins', type: 'INTEGER' },
        ],
      },
      {
        name: 'watch_history',
        rowCount: 85000,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true },
          { name: 'user_id', type: 'INTEGER' },
          { name: 'title_id', type: 'INTEGER', isForeignKey: true, references: 'titles.id' },
          { name: 'watched_mins', type: 'INTEGER' },
          { name: 'device', type: 'TEXT' },
          { name: 'timestamp', type: 'TEXT' },
        ],
      },
    ],
    data: {
      titles: [
        { id: 1, title: 'Database Mavericks', type: 'Series', release_year: 2025, rating: 9.4, duration_mins: 45 },
        { id: 2, title: 'The Indexing Conundrum', type: 'Movie', release_year: 2024, rating: 8.8, duration_mins: 118 },
        { id: 3, title: 'Silicon Valley Heist', type: 'Movie', release_year: 2023, rating: 8.5, duration_mins: 132 },
        { id: 4, title: 'Deep Neural Horizons', type: 'Docuseries', release_year: 2026, rating: 9.1, duration_mins: 55 },
      ],
      watch_history: [
        { id: 101, user_id: 55, title_id: 1, watched_mins: 45, device: 'Mobile iOS', timestamp: '2026-08-11 21:10:00' },
        { id: 102, user_id: 55, title_id: 2, watched_mins: 118, device: 'Smart TV', timestamp: '2026-08-10 19:40:00' },
        { id: 103, user_id: 82, title_id: 3, watched_mins: 60, device: 'Web Chrome', timestamp: '2026-08-12 02:15:00' },
      ],
    },
  },
  {
    id: 'hospital_care',
    name: 'Central Health Hospital',
    category: 'Healthcare',
    description: 'Patient admissions, doctors, diagnoses, prescriptions, and ICU bed allocations.',
    iconName: 'HeartPulse',
    dialect: 'MySQL',
    tables: [
      {
        name: 'patients',
        rowCount: 3400,
        columns: [
          { name: 'patient_id', type: 'INT', isPrimaryKey: true },
          { name: 'first_name', type: 'VARCHAR(50)' },
          { name: 'last_name', type: 'VARCHAR(50)' },
          { name: 'blood_type', type: 'VARCHAR(5)' },
          { name: 'dob', type: 'DATE' },
        ],
      },
      {
        name: 'admissions',
        rowCount: 8900,
        columns: [
          { name: 'admission_id', type: 'INT', isPrimaryKey: true },
          { name: 'patient_id', type: 'INT', isForeignKey: true, references: 'patients.patient_id' },
          { name: 'doctor_id', type: 'INT' },
          { name: 'diagnosis', type: 'VARCHAR(100)' },
          { name: 'admitted_at', type: 'DATETIME' },
          { name: 'discharged_at', type: 'DATETIME' },
        ],
      },
    ],
    data: {
      patients: [
        { patient_id: 501, first_name: 'Arthur', last_name: 'Pena', blood_type: 'O+', dob: '1985-04-12' },
        { patient_id: 502, first_name: 'Clara', last_name: 'Oswald', blood_type: 'A-', dob: '1992-09-28' },
        { patient_id: 503, first_name: 'Robert', last_name: 'Langdon', blood_type: 'AB+', dob: '1976-11-03' },
      ],
      admissions: [
        { admission_id: 901, patient_id: 501, doctor_id: 12, diagnosis: 'Acute Appendicitis', admitted_at: '2026-08-01 08:00:00', discharged_at: '2026-08-03 14:00:00' },
        { admission_id: 902, patient_id: 502, doctor_id: 18, diagnosis: 'Hypertension Crisis', admitted_at: '2026-08-05 12:30:00', discharged_at: '2026-08-07 10:15:00' },
      ],
    },
  },
  {
    id: 'bank_fintech',
    name: 'Apex Reserve Bank',
    category: 'Finance',
    description: 'Accounts, real-time ledger transfers, fraud risk scores, and audit trail logs.',
    iconName: 'Landmark',
    dialect: 'PostgreSQL',
    tables: [
      {
        name: 'accounts',
        rowCount: 5400,
        columns: [
          { name: 'acc_no', type: 'VARCHAR(20)', isPrimaryKey: true },
          { name: 'holder_name', type: 'VARCHAR(100)' },
          { name: 'account_type', type: 'VARCHAR(20)' },
          { name: 'balance', type: 'NUMERIC(15,2)' },
          { name: 'currency', type: 'VARCHAR(3)' },
        ],
      },
      {
        name: 'ledger_entries',
        rowCount: 240000,
        columns: [
          { name: 'entry_id', type: 'UUID', isPrimaryKey: true },
          { name: 'src_account', type: 'VARCHAR(20)' },
          { name: 'dst_account', type: 'VARCHAR(20)' },
          { name: 'amount', type: 'NUMERIC(12,2)' },
          { name: 'trans_type', type: 'VARCHAR(20)' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
    ],
    data: {
      accounts: [
        { acc_no: 'ACC-882910', holder_name: 'Satoshi Nakamoto', account_type: 'Checking', balance: 5420000.00, currency: 'USD' },
        { acc_no: 'ACC-449120', holder_name: 'Grace Hopper', account_type: 'Savings', balance: 189000.50, currency: 'USD' },
        { acc_no: 'ACC-110293', holder_name: 'Alan Turing', account_type: 'Investment', balance: 940000.00, currency: 'GBP' },
      ],
      ledger_entries: [
        { entry_id: 'ledg-001', src_account: 'ACC-882910', dst_account: 'ACC-449120', amount: 25000.00, trans_type: 'WIRE_TRANSFER', created_at: '2026-08-11 15:40:00' },
        { entry_id: 'ledg-002', src_account: 'ACC-110293', dst_account: 'ACC-882910', amount: 5000.00, trans_type: 'ACH_CREDIT', created_at: '2026-08-12 01:20:00' },
      ],
    },
  },
  {
    id: 'spotify_audio',
    name: 'SoundWave Music Engine',
    category: 'Audio Streaming',
    description: 'Tracks, albums, artists, playlists, user stream history, and top charts.',
    iconName: 'Music',
    dialect: 'MariaDB',
    tables: [
      {
        name: 'tracks',
        rowCount: 14000,
        columns: [
          { name: 'track_id', type: 'INT', isPrimaryKey: true },
          { name: 'title', type: 'VARCHAR(150)' },
          { name: 'artist_name', type: 'VARCHAR(100)' },
          { name: 'bpm', type: 'INT' },
          { name: 'streams_count', type: 'BIGINT' },
        ],
      },
    ],
    data: {
      tracks: [
        { track_id: 101, title: 'Midnight Query Optimization', artist_name: 'The Relational Engine', bpm: 124, streams_count: 8500000 },
        { track_id: 102, title: 'Sub-10ms Dreamscape', artist_name: 'B-Tree Synth', bpm: 110, streams_count: 3200000 },
      ],
    },
  },
  {
    id: 'airbnb_stays',
    name: 'StayHub Vacation Rentals',
    category: 'Travel',
    description: 'Listings, hosts, bookings, reviews, nightly rates, and geo-coordinates.',
    iconName: 'Home',
    dialect: 'PostgreSQL',
    tables: [
      {
        name: 'listings',
        rowCount: 2400,
        columns: [
          { name: 'id', type: 'INT', isPrimaryKey: true },
          { name: 'name', type: 'VARCHAR(150)' },
          { name: 'city', type: 'VARCHAR(50)' },
          { name: 'price_per_night', type: 'DECIMAL(8,2)' },
          { name: 'rating', type: 'DECIMAL(3,2)' },
        ],
      },
    ],
    data: {
      listings: [
        { id: 1001, name: 'Minimalist Alpine Glass Loft', city: 'Zurich', price_per_night: 280.00, rating: 4.95 },
        { id: 1002, name: 'Oceanfront Sunset Villa', city: 'Santorini', price_per_night: 450.00, rating: 4.98 },
      ],
    },
  },
  {
    id: 'school_edu',
    name: 'University Student Portal',
    category: 'Education',
    description: 'Students, courses, enrollments, GPA scores, and professor departments.',
    iconName: 'GraduationCap',
    dialect: 'SQL Server',
    tables: [
      {
        name: 'students',
        rowCount: 2100,
        columns: [
          { name: 'student_id', type: 'INT', isPrimaryKey: true },
          { name: 'full_name', type: 'NVARCHAR(100)' },
          { name: 'major', type: 'NVARCHAR(50)' },
          { name: 'gpa', type: 'FLOAT' },
        ],
      },
    ],
    data: {
      students: [
        { student_id: 202501, full_name: 'Samantha Reed', major: 'Computer Science', gpa: 3.92 },
        { student_id: 202502, full_name: 'Liam Neeson', major: 'Data Engineering', gpa: 3.85 },
      ],
    },
  },
  {
    id: 'library_books',
    name: 'City Central Library',
    category: 'Public Sector',
    description: 'Books, authors, loans, overdue fines, and ISBN catalog records.',
    iconName: 'Book',
    dialect: 'SQLite',
    tables: [
      {
        name: 'books',
        rowCount: 18000,
        columns: [
          { name: 'isbn', type: 'TEXT', isPrimaryKey: true },
          { name: 'title', type: 'TEXT' },
          { name: 'author', type: 'TEXT' },
          { name: 'copies_available', type: 'INTEGER' },
        ],
      },
    ],
    data: {
      books: [
        { isbn: '978-0131103627', title: 'The C Programming Language', author: 'Kernighan & Ritchie', copies_available: 4 },
        { isbn: '978-0596007126', title: 'Head First Design Patterns', author: 'Freeman et al.', copies_available: 2 },
      ],
    },
  },
  {
    id: 'inventory_wh',
    name: 'LogiChain Warehouse',
    category: 'Logistics',
    description: 'Stock bins, suppliers, purchase orders, reorder thresholds, and shipments.',
    iconName: 'Boxes',
    dialect: 'Oracle',
    tables: [
      {
        name: 'inventory_items',
        rowCount: 4500,
        columns: [
          { name: 'sku', type: 'VARCHAR2(30)', isPrimaryKey: true },
          { name: 'item_name', type: 'VARCHAR2(100)' },
          { name: 'qty_on_hand', type: 'NUMBER' },
          { name: 'reorder_point', type: 'NUMBER' },
        ],
      },
    ],
    data: {
      inventory_items: [
        { sku: 'SKU-NVME-2TB', item_name: 'NVMe SSD 2TB Enterprise', qty_on_hand: 145, reorder_point: 30 },
        { sku: 'SKU-GPU-H100', item_name: 'Tensor Compute GPU 80GB', qty_on_hand: 12, reorder_point: 10 },
      ],
    },
  },
  {
    id: 'sales_crm',
    name: 'SaaS Deal Pipeline CRM',
    category: 'Sales B2B',
    description: 'Leads, deal stages, ARR forecast, account executives, and call logs.',
    iconName: 'TrendingUp',
    dialect: 'PostgreSQL',
    tables: [
      {
        name: 'deals',
        rowCount: 1100,
        columns: [
          { name: 'deal_id', type: 'UUID', isPrimaryKey: true },
          { name: 'company_name', type: 'VARCHAR(100)' },
          { name: 'arr_value', type: 'DECIMAL(12,2)' },
          { name: 'stage', type: 'VARCHAR(30)' },
        ],
      },
    ],
    data: {
      deals: [
        { deal_id: 'deal-001', company_name: 'Acme Global AI', arr_value: 120000.00, stage: 'Negotiation' },
        { deal_id: 'deal-002', company_name: 'Starlight Media', arr_value: 48000.00, stage: 'Closed Won' },
      ],
    },
  },
  {
    id: 'hr_global',
    name: 'OmniWork Global Talent',
    category: 'HR & Contractors',
    description: 'Remote contracts, timecards, compliance documents, and invoice payouts.',
    iconName: 'Briefcase',
    dialect: 'MySQL',
    tables: [
      {
        name: 'contractors',
        rowCount: 890,
        columns: [
          { name: 'id', type: 'INT', isPrimaryKey: true },
          { name: 'contractor_name', type: 'VARCHAR(100)' },
          { name: 'hourly_rate', type: 'DECIMAL(8,2)' },
          { name: 'country', type: 'VARCHAR(50)' },
        ],
      },
    ],
    data: {
      contractors: [
        { id: 1, contractor_name: 'Carlos Mendoza', hourly_rate: 95.00, country: 'Spain' },
        { id: 2, contractor_name: 'Yuki Tanaka', hourly_rate: 110.00, country: 'Japan' },
      ],
    },
  },
];
