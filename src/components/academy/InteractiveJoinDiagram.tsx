import React, { useState } from 'react';
import { Layers, GitMerge, ArrowRight, CheckCircle2 } from 'lucide-react';

type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';

interface CustomerRow {
  id: number;
  name: string;
}

interface OrderRow {
  id: number;
  customerId: number;
  amount: number;
}

const CUSTOMERS: CustomerRow[] = [
  { id: 1, name: 'Alice Smith' },
  { id: 2, name: 'Bob Jones' },
  { id: 3, name: 'Carol White' },
  { id: 4, name: 'David Lee' },
];

const ORDERS: OrderRow[] = [
  { id: 101, customerId: 1, amount: 250 },
  { id: 102, customerId: 2, amount: 120 },
  { id: 103, customerId: 2, amount: 80 },
  { id: 104, customerId: 5, amount: 450 }, // Customer ID 5 doesn't exist in CUSTOMERS
];

interface JoinedRow {
  cId: number | string;
  name: string;
  oId: number | string;
  amount: string;
  matched: boolean;
}

export const InteractiveJoinDiagram: React.FC = () => {
  const [selectedJoin, setSelectedJoin] = useState<JoinType>('LEFT');

  // Compute joined output dataset based on join type
  const getJoinedRows = (): JoinedRow[] => {
    switch (selectedJoin) {
      case 'INNER':
        return CUSTOMERS.flatMap((c) => {
          const matches = ORDERS.filter((o) => o.customerId === c.id);
          return matches.map((m) => ({
            cId: c.id,
            name: c.name,
            oId: m.id,
            amount: `$${m.amount}`,
            matched: true,
          }));
        });

      case 'LEFT':
        return CUSTOMERS.flatMap((c): JoinedRow[] => {
          const matches = ORDERS.filter((o) => o.customerId === c.id);
          if (matches.length === 0) {
            return [{ cId: c.id, name: c.name, oId: 'NULL', amount: 'NULL', matched: false }];
          }
          return matches.map((m) => ({
            cId: c.id,
            name: c.name,
            oId: m.id,
            amount: `$${m.amount}`,
            matched: true,
          }));
        });

      case 'RIGHT':
        return ORDERS.map((o): JoinedRow => {
          const match = CUSTOMERS.find((c) => c.id === o.customerId);
          return {
            cId: match ? match.id : 'NULL',
            name: match ? match.name : 'NULL',
            oId: o.id,
            amount: `$${o.amount}`,
            matched: !!match,
          };
        });

      case 'FULL': {
        const leftSide: JoinedRow[] = CUSTOMERS.flatMap((c): JoinedRow[] => {
          const matches = ORDERS.filter((o) => o.customerId === c.id);
          if (matches.length === 0) {
            return [{ cId: c.id, name: c.name, oId: 'NULL', amount: 'NULL', matched: false }];
          }
          return matches.map((m) => ({
            cId: c.id,
            name: c.name,
            oId: m.id,
            amount: `$${m.amount}`,
            matched: true,
          }));
        });

        const unmatchedRight: JoinedRow[] = ORDERS.filter(
          (o) => !CUSTOMERS.some((c) => c.id === o.customerId)
        ).map((o) => ({
          cId: 'NULL',
          name: 'NULL',
          oId: o.id,
          amount: `$${o.amount}`,
          matched: false,
        }));

        return [...leftSide, ...unmatchedRight];
      }

      case 'CROSS':
        return CUSTOMERS.slice(0, 2).flatMap((c) =>
          ORDERS.slice(0, 2).map((o) => ({
            cId: c.id,
            name: c.name,
            oId: o.id,
            amount: `$${o.amount}`,
            matched: true,
          }))
        );
    }
  };

  const results = getJoinedRows();

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 md:p-5 space-y-4 my-4 font-sans select-none">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2D2D31] pb-3">
        <div className="flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-[#62DF7D]" />
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF]">Interactive Relational Join Visualizer</h3>
            <p className="text-xs text-[#8A8A90]">Select a join type to see row matching mechanics in real time</p>
          </div>
        </div>

        {/* Join Type Selectors */}
        <div className="flex items-center gap-1 bg-[#131315] p-1 rounded-xl border border-[#2D2D31] text-xs font-mono overflow-x-auto w-full sm:w-auto">
          {(['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS'] as JoinType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedJoin(type)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedJoin === type
                  ? 'bg-[#62DF7D] text-[#131315] shadow-md'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Venn Diagram Graphics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#131315] p-4 rounded-xl border border-[#2D2D31]">
        {/* Left Table: Customers */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#8A8A90]">
            <span className="font-bold text-[#FFFFFF]">Left Table: Customers</span>
            <span>4 Rows</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {CUSTOMERS.map((c) => (
              <div
                key={c.id}
                className="p-2 rounded bg-[#1B1B1E] border border-[#2D2D31] flex justify-between text-[#8A8A90]"
              >
                <span>ID: {c.id}</span>
                <span className="text-[#FFFFFF]">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Venn graphic */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <div className="relative w-36 h-20 flex items-center justify-center">
            {/* Left Circle */}
            <div
              className={`absolute left-2 w-20 h-20 rounded-full border-2 transition-colors ${
                selectedJoin === 'LEFT' || selectedJoin === 'FULL' || selectedJoin === 'INNER'
                  ? 'bg-[#62DF7D]/20 border-[#62DF7D]'
                  : 'bg-[#232326]/50 border-[#2D2D31]'
              }`}
            />
            {/* Right Circle */}
            <div
              className={`absolute right-2 w-20 h-20 rounded-full border-2 transition-colors ${
                selectedJoin === 'RIGHT' || selectedJoin === 'FULL' || selectedJoin === 'INNER'
                  ? 'bg-[#62DF7D]/20 border-[#62DF7D]'
                  : 'bg-[#232326]/50 border-[#2D2D31]'
              }`}
            />
            {/* Intersection Highlight */}
            <div
              className={`absolute w-10 h-16 rounded-full transition-colors ${
                selectedJoin === 'INNER'
                  ? 'bg-[#62DF7D]/60'
                  : selectedJoin === 'LEFT' || selectedJoin === 'RIGHT' || selectedJoin === 'FULL'
                  ? 'bg-[#62DF7D]/30'
                  : 'bg-transparent'
              }`}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#62DF7D] flex items-center gap-1">
            {selectedJoin} JOIN <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Right Table: Orders */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#8A8A90]">
            <span className="font-bold text-[#FFFFFF]">Right Table: Orders</span>
            <span>4 Rows</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {ORDERS.map((o) => (
              <div
                key={o.id}
                className="p-2 rounded bg-[#1B1B1E] border border-[#2D2D31] flex justify-between text-[#8A8A90]"
              >
                <span>Ord: {o.id} (Cust:{o.customerId})</span>
                <span className="text-[#62DF7D]">${o.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output Dataset Preview */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-[#FFFFFF] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#62DF7D]" /> Resulting Output Table ({results.length} rows)
          </span>
          <span className="text-[#8A8A90] font-sans">
            {selectedJoin === 'INNER' && 'Only matched rows in both tables'}
            {selectedJoin === 'LEFT' && 'All left rows + matched right rows'}
            {selectedJoin === 'RIGHT' && 'All right rows + matched left rows'}
            {selectedJoin === 'FULL' && 'All rows from both tables matched or null'}
            {selectedJoin === 'CROSS' && 'Cartesian product of left and right tables'}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#2D2D31] bg-[#131315]">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#1B1B1E] border-b border-[#2D2D31] text-[#8A8A90]">
                <th className="p-2.5">Customer ID</th>
                <th className="p-2.5">Customer Name</th>
                <th className="p-2.5">Order ID</th>
                <th className="p-2.5">Order Amount</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#2D2D31]/50 hover:bg-[#1B1B1E] transition-colors"
                >
                  <td className="p-2.5 text-[#8A8A90]">{row.cId}</td>
                  <td className="p-2.5 text-[#FFFFFF] font-medium">{row.name}</td>
                  <td className="p-2.5 text-[#8A8A90]">{row.oId}</td>
                  <td
                    className={`p-2.5 font-bold ${
                      row.amount === 'NULL' ? 'text-[#8A8A90]' : 'text-[#62DF7D]'
                    }`}
                  >
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
