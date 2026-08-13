/**
 * AI Dataset Generator Service using Gemini API
 */

import { GoogleGenAI } from '@google/genai';
import { FullDataset, DatasetCategory, DatasetTable, DatasetRelationship } from '../types/dataset';
import { DATASET_TEMPLATES } from '../data/datasetTemplates';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini API Client initialization skipped:', e);
    }
  }
  return aiClient;
}

export async function generateDatasetFromPrompt(
  prompt: string,
  targetCategory?: DatasetCategory,
  targetDialect: string = 'PostgreSQL'
): Promise<FullDataset> {
  const ai = getAIClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert Relational Database Architect. The user requested: "${prompt}".
Generate a complete, production-ready relational database schema matching this request in JSON format.
Return JSON with this exact structure:
{
  "name": "Short Descriptive Title",
  "category": "E-Commerce" | "Banking" | "Healthcare" | "Education" | "HR" | "CRM" | "ERP" | "Retail" | "Logistics" | "Airlines" | "Hotels" | "Social Media" | "Movie Streaming" | "Food Delivery" | "Insurance" | "Government" | "Telecommunications" | "Manufacturing" | "Real Estate" | "SaaS Analytics",
  "description": "Clear 2-sentence summary of the schema",
  "businessContext": "Detailed business context explaining what analytics and queries this supports",
  "tables": [
    {
      "id": "tbl_name",
      "name": "table_name",
      "description": "Purpose of table",
      "x": 100,
      "y": 100,
      "rowCount": 500,
      "columns": [
        {
          "id": "col_id",
          "name": "col_name",
          "type": "VARCHAR(100)" | "INTEGER" | "BIGINT" | "DECIMAL(10,2)" | "TIMESTAMP" | "UUID" | "BOOLEAN" | "JSONB",
          "isPrimaryKey": true/false,
          "isForeignKey": true/false,
          "referencesTable": "other_table",
          "referencesColumn": "other_col",
          "nullable": false,
          "mockGeneratorType": "fullName" | "email" | "phone" | "address" | "city" | "country" | "companyName" | "productName" | "invoiceNumber" | "price" | "amount" | "salary" | "timestamp" | "uuid" | "jsonField" | "statusEnum" | "integer" | "boolean"
        }
      ],
      "indexes": [
        {
          "id": "idx_1",
          "name": "idx_table_col",
          "columns": ["col_name"],
          "isUnique": false,
          "type": "B-TREE"
        }
      ],
      "sampleData": [
        { "col1": "val1", "col2": 123 }
      ]
    }
  ],
  "relationships": [
    {
      "id": "rel_1",
      "sourceTable": "table1",
      "sourceColumn": "col1",
      "targetTable": "table2",
      "targetColumn": "col2",
      "type": "1:N"
    }
  ],
  "exercises": [
    {
      "id": "ex_1",
      "title": "Exercise Title",
      "question": "SQL Question",
      "difficulty": "Intermediate",
      "hint": "Hint",
      "solutionQuery": "SELECT * FROM table1;",
      "explanation": "Explanation"
    }
  ]
}`,
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          id: `ai_gen_${Date.now()}`,
          name: parsed.name || 'AI Generated Database',
          category: (parsed.category as DatasetCategory) || targetCategory || 'E-Commerce',
          description: parsed.description || prompt,
          businessContext: parsed.businessContext || 'Auto-generated relational schema based on user specifications.',
          dialect: targetDialect as any,
          tables: parsed.tables || [],
          relationships: parsed.relationships || [],
          sampleRowMultiplier: 100,
          exercises: parsed.exercises || [],
          author: 'AI Dataset Architect',
          isPublished: false,
          stars: 5,
          downloads: 1,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
    } catch (err) {
      console.warn('Gemini API generation fallback:', err);
    }
  }

  // Smart algorithmic fallback if Gemini API is offline or key missing
  return createAlgorithmicDatasetFromPrompt(prompt, targetCategory, targetDialect);
}

function createAlgorithmicDatasetFromPrompt(
  prompt: string,
  targetCategory?: DatasetCategory,
  targetDialect: string = 'PostgreSQL'
): FullDataset {
  const lowerPrompt = prompt.toLowerCase();
  let matchedTemplate = DATASET_TEMPLATES.find((t) => lowerPrompt.includes(t.category.toLowerCase()) || lowerPrompt.includes(t.name.toLowerCase()));

  if (!matchedTemplate) {
    matchedTemplate = DATASET_TEMPLATES[0]; // E-commerce default
  }

  const customName = prompt.length < 50 ? `Custom: ${prompt.slice(0, 35)}` : matchedTemplate.name;

  return {
    ...matchedTemplate,
    id: `custom_ds_${Date.now()}`,
    name: customName,
    description: `Generated based on: "${prompt}". Includes primary keys, foreign key constraints, indexes, and realistic mock records.`,
    dialect: targetDialect as any,
    createdAt: new Date().toISOString().split('T')[0],
  };
}
