import { create } from 'zustand';
import {
  FullDataset,
  DatasetTable,
  DatasetColumn,
  DatasetRelationship,
  MarketplaceFilter,
  DatasetCategory,
} from '../types/dataset';
import { DATASET_TEMPLATES } from '../data/datasetTemplates';

export type DatasetBuilderSubTab =
  | 'prompt'
  | 'templates'
  | 'designer'
  | 'datagen'
  | 'scenarios'
  | 'sqllab'
  | 'performance'
  | 'marketplace'
  | 'importexport';

interface DatasetState {
  currentDataset: FullDataset;
  datasets: FullDataset[];
  selectedTableId: string | null;
  activeSubTab: DatasetBuilderSubTab;
  isAiGenerating: boolean;
  mockRowCount: number;
  marketplaceFilter: MarketplaceFilter;
  bookmarkedDatasetIds: string[];

  // Actions
  setActiveSubTab: (tab: DatasetBuilderSubTab) => void;
  setCurrentDataset: (dataset: FullDataset) => void;
  setSelectedTableId: (id: string | null) => void;
  setIsAiGenerating: (generating: boolean) => void;
  setMockRowCount: (count: number) => void;
  setMarketplaceFilter: (filter: Partial<MarketplaceFilter>) => void;
  toggleBookmark: (datasetId: string) => void;
  rateDataset: (datasetId: string, rating: number) => void;

  // Schema Manipulation for Visual Designer
  addTable: (name: string, description?: string) => void;
  updateTablePosition: (tableId: string, x: number, y: number) => void;
  deleteTable: (tableId: string) => void;
  addColumnToTable: (tableId: string, column: Omit<DatasetColumn, 'id'>) => void;
  deleteColumnFromTable: (tableId: string, columnId: string) => void;
  addRelationship: (rel: Omit<DatasetRelationship, 'id'>) => void;
  deleteRelationship: (relId: string) => void;
  addDataset: (dataset: FullDataset) => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  currentDataset: DATASET_TEMPLATES[0],
  datasets: DATASET_TEMPLATES,
  selectedTableId: DATASET_TEMPLATES[0].tables[0]?.id || null,
  activeSubTab: 'prompt',
  isAiGenerating: false,
  mockRowCount: 1000,
  marketplaceFilter: {
    category: 'All',
    searchQuery: '',
    sortBy: 'popular',
  },
  bookmarkedDatasetIds: ['ecommerce_template', 'banking_template'],

  setActiveSubTab: (tab) => set({ activeSubTab: tab }),
  setCurrentDataset: (dataset) =>
    set({
      currentDataset: dataset,
      selectedTableId: dataset.tables[0]?.id || null,
    }),
  setSelectedTableId: (id) => set({ selectedTableId: id }),
  setIsAiGenerating: (generating) => set({ isAiGenerating: generating }),
  setMockRowCount: (count) => set({ mockRowCount: count }),

  setMarketplaceFilter: (filter) =>
    set((state) => ({
      marketplaceFilter: { ...state.marketplaceFilter, ...filter },
    })),

  toggleBookmark: (datasetId) =>
    set((state) => {
      const exists = state.bookmarkedDatasetIds.includes(datasetId);
      return {
        bookmarkedDatasetIds: exists
          ? state.bookmarkedDatasetIds.filter((id) => id !== datasetId)
          : [...state.bookmarkedDatasetIds, datasetId],
      };
    }),

  rateDataset: (datasetId, rating) =>
    set((state) => ({
      datasets: state.datasets.map((d) =>
        d.id === datasetId ? { ...d, stars: d.stars + (rating > 3 ? 1 : 0) } : d
      ),
    })),

  addTable: (name, description = 'New relational table') =>
    set((state) => {
      const newTable: DatasetTable = {
        id: `tbl_${Date.now()}`,
        name: name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        description,
        x: 200 + Math.random() * 100,
        y: 150 + Math.random() * 100,
        rowCount: 100,
        columns: [
          {
            id: `col_id_${Date.now()}`,
            name: `${name.toLowerCase()}_id`,
            type: 'INTEGER',
            isPrimaryKey: true,
            isForeignKey: false,
            nullable: false,
            mockGeneratorType: 'integer',
          },
        ],
        indexes: [],
        sampleData: [],
      };

      const updated = {
        ...state.currentDataset,
        tables: [...state.currentDataset.tables, newTable],
      };

      return {
        currentDataset: updated,
        selectedTableId: newTable.id,
      };
    }),

  updateTablePosition: (tableId, x, y) =>
    set((state) => ({
      currentDataset: {
        ...state.currentDataset,
        tables: state.currentDataset.tables.map((t) =>
          t.id === tableId ? { ...t, x, y } : t
        ),
      },
    })),

  deleteTable: (tableId) =>
    set((state) => {
      const tbl = state.currentDataset.tables.find((t) => t.id === tableId);
      if (!tbl) return state;

      return {
        currentDataset: {
          ...state.currentDataset,
          tables: state.currentDataset.tables.filter((t) => t.id !== tableId),
          relationships: state.currentDataset.relationships.filter(
            (r) => r.sourceTable !== tbl.name && r.targetTable !== tbl.name
          ),
        },
        selectedTableId: null,
      };
    }),

  addColumnToTable: (tableId, colData) =>
    set((state) => {
      const newCol: DatasetColumn = {
        ...colData,
        id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };

      return {
        currentDataset: {
          ...state.currentDataset,
          tables: state.currentDataset.tables.map((t) =>
            t.id === tableId ? { ...t, columns: [...t.columns, newCol] } : t
          ),
        },
      };
    }),

  deleteColumnFromTable: (tableId, columnId) =>
    set((state) => ({
      currentDataset: {
        ...state.currentDataset,
        tables: state.currentDataset.tables.map((t) =>
          t.id === tableId
            ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) }
            : t
        ),
      },
    })),

  addRelationship: (rel) =>
    set((state) => ({
      currentDataset: {
        ...state.currentDataset,
        relationships: [
          ...state.currentDataset.relationships,
          { ...rel, id: `rel_${Date.now()}` },
        ],
      },
    })),

  deleteRelationship: (relId) =>
    set((state) => ({
      currentDataset: {
        ...state.currentDataset,
        relationships: state.currentDataset.relationships.filter(
          (r) => r.id !== relId
        ),
      },
    })),

  addDataset: (dataset) =>
    set((state) => ({
      datasets: [dataset, ...state.datasets],
      currentDataset: dataset,
    })),
}));
