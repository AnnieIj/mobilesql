import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { PRACTICE_DATABASES } from '../../data/playgroundDatabases';

interface MonacoSQLEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRunQuery: () => void;
  onFormatQuery?: () => void;
}

export const MonacoSQLEditor: React.FC<MonacoSQLEditorProps> = ({
  value,
  onChange,
  onRunQuery,
  onFormatQuery,
}) => {
  const { fontSize, wordWrap, minimapEnabled, tabs, activeTabId } = usePlaygroundStore();
  const editorRef = useRef<any>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeDb =
    PRACTICE_DATABASES.find((d) => d.id === activeTab?.databaseId) || PRACTICE_DATABASES[0];

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Define custom Obsidian Dark theme
    monaco.editor.defineTheme('obsidian-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword.sql', foreground: '62DF7D', fontStyle: 'bold' },
        { token: 'string.sql', foreground: 'F59E0B' },
        { token: 'comment.sql', foreground: '8A8A90', fontStyle: 'italic' },
        { token: 'number.sql', foreground: '3B82F6' },
        { token: 'identifier.sql', foreground: 'FFFFFF' },
      ],
      colors: {
        'editor.background': '#131315',
        'editor.foreground': '#FFFFFF',
        'editor.lineHighlightBackground': '#1F1F23',
        'editorLineNumber.foreground': '#4B4B52',
        'editorLineNumber.activeForeground': '#62DF7D',
        'editorCursor.foreground': '#62DF7D',
        'editor.selectionBackground': '#2A3F33',
        'editor.inactiveSelectionBackground': '#1E2B23',
      },
    });

    monaco.editor.setTheme('obsidian-dark');

    // Register SQL Autocomplete Items from Active Schema
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: any[] = [];

        // Table Suggestions
        activeDb.tables.forEach((tbl) => {
          suggestions.push({
            label: tbl.name,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: tbl.name,
            detail: `Table (${tbl.rowCount} rows)`,
            range,
          });

          // Column Suggestions
          tbl.columns.forEach((col) => {
            suggestions.push({
              label: `${tbl.name}.${col.name}`,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: col.name,
              detail: `${col.type} - Table: ${tbl.name}`,
              range,
            });
          });
        });

        // Common SQL Keywords
        const keywords = [
          'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
          'FULL JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'WITH',
          'RECURSIVE', 'OVER', 'PARTITION BY', 'DENSE_RANK', 'ROW_NUMBER', 'CASE',
          'WHEN', 'THEN', 'ELSE', 'END', 'EXPLAIN', 'ANALYZE',
        ];

        keywords.forEach((kw) => {
          suggestions.push({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
            detail: 'SQL Keyword',
            range,
          });
        });

        return { suggestions };
      },
    });

    // Add Keyboard Shortcut: Ctrl/Cmd + Enter to Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunQuery();
    });

    // Add Keyboard Shortcut: Ctrl/Cmd + Shift + F to Format
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        onFormatQuery?.();
      }
    );
  };

  return (
    <div className="w-full h-full bg-[#131315] relative overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="sql"
        theme="obsidian-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize,
          wordWrap,
          minimap: { enabled: minimapEnabled },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontFamily: "'JetBrains Mono', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabSize: 2,
        }}
        loading={
          <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-[#8A8A90] bg-[#131315]">
            <div className="w-6 h-6 border-2 border-[#62DF7D] border-t-transparent rounded-full animate-spin mb-2" />
            Initializing Monaco SQL Engine...
          </div>
        }
      />
    </div>
  );
};
