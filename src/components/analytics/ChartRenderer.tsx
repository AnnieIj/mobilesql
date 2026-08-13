import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartConfig } from '../../types/analytics';
import { getChartDataForType } from '../../services/analyticsEngine';

interface ChartRendererProps {
  config: ChartConfig;
  onDrillDown?: (dataPoint: Record<string, unknown>) => void;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, onDrillDown }) => {
  const data = getChartDataForType(config.chartType);
  const colors = config.colorPalette.length > 0 ? config.colorPalette : ['#62DF7D', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const handlePointClick = (entry: Record<string, unknown>) => {
    if (onDrillDown) {
      onDrillDown(entry);
    }
  };

  // Custom Chart Renderers for types not directly handled by standard Recharts shapes
  switch (config.chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#2D2D31" />}
            <XAxis type="number" stroke="#8A8A90" fontSize={10} tickLine={false} />
            <YAxis dataKey={config.xAxisKey || 'name'} type="category" stroke="#8A8A90" fontSize={10} tickLine={false} width={80} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{ backgroundColor: '#1B1B1E', borderColor: '#2D2D31', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
              />
            )}
            {config.showLegend && <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A90' }} />}
            {config.yAxisKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[idx % colors.length]}
                radius={[0, 4, 4, 0]}
                onClick={(entry) => handlePointClick(entry as unknown as Record<string, unknown>)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'column':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#2D2D31" />}
            <XAxis dataKey={config.xAxisKey || 'name'} stroke="#8A8A90" fontSize={10} tickLine={false} />
            <YAxis stroke="#8A8A90" fontSize={10} tickLine={false} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{ backgroundColor: '#1B1B1E', borderColor: '#2D2D31', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
              />
            )}
            {config.showLegend && <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A90' }} />}
            {config.yAxisKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[idx % colors.length]}
                radius={[4, 4, 0, 0]}
                onClick={(entry) => handlePointClick(entry as unknown as Record<string, unknown>)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#2D2D31" />}
            <XAxis dataKey={config.xAxisKey || 'month'} stroke="#8A8A90" fontSize={10} tickLine={false} />
            <YAxis stroke="#8A8A90" fontSize={10} tickLine={false} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{ backgroundColor: '#1B1B1E', borderColor: '#2D2D31', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
              />
            )}
            {config.showLegend && <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A90' }} />}
            {config.yAxisKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={3}
                dot={{ r: 4, fill: colors[idx % colors.length] }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                onClick={(entry) => handlePointClick(entry as unknown as Record<string, unknown>)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#2D2D31" />}
            <XAxis dataKey={config.xAxisKey || 'month'} stroke="#8A8A90" fontSize={10} tickLine={false} />
            <YAxis stroke="#8A8A90" fontSize={10} tickLine={false} />
            {config.showTooltip && (
              <Tooltip
                contentStyle={{ backgroundColor: '#1B1B1E', borderColor: '#2D2D31', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
              />
            )}
            {config.showLegend && <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A90' }} />}
            {config.yAxisKeys.map((key, idx) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'pie':
    case 'donut':
      const isDonut = config.chartType === 'donut';
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isDonut ? 45 : 0}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} className="cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </Pie>
            {config.showTooltip && (
              <Tooltip
                contentStyle={{ backgroundColor: '#1B1B1E', borderColor: '#2D2D31', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
              />
            )}
            {config.showLegend && <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A90' }} />}
          </PieChart>
        </ResponsiveContainer>
      );

    case 'scatter':
    case 'bubble':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#2D2D31" />}
            <XAxis type="number" dataKey="x" name="Metric X" stroke="#8A8A90" fontSize={10} />
            <YAxis type="number" dataKey="y" name="Metric Y" stroke="#8A8A90" fontSize={10} />
            {config.showTooltip && (
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1B1B1E', borderColor: '#2D2D31', color: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
              />
            )}
            <Scatter name="Data Correlator" data={data} fill={colors[0]}>
              {data.map((_, index) => (
                <Cell key={`scatter-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={70} data={data}>
            <PolarGrid stroke="#2D2D31" />
            <PolarAngleAxis dataKey="metric" stroke="#8A8A90" fontSize={10} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#2D2D31" fontSize={9} />
            <Radar name="Enterprise Tier" dataKey="Enterprise" stroke="#62DF7D" fill="#62DF7D" fillOpacity={0.4} />
            <Radar name="Standard Tier" dataKey="Standard" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#8A8A90' }} />
          </RadarChart>
        </ResponsiveContainer>
      );

    case 'gauge':
      const gaugeVal = (data[0]?.percentage as number) || 78.4;
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-2 p-2">
          <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
            {/* Half circle background */}
            <div className="w-36 h-36 rounded-full border-[12px] border-[#2D2D31] border-b-transparent border-l-transparent transform -rotate-45" />
            {/* Active gauge bar */}
            <div
              className="absolute w-36 h-36 rounded-full border-[12px] border-[#62DF7D] border-b-transparent border-l-transparent transform transition-transform duration-1000"
              style={{
                transform: `rotate(${Math.min(180, (gaugeVal / 100) * 180) - 135}deg)`,
              }}
            />
            <div className="absolute text-center bottom-1">
              <span className="text-2xl font-black text-[#FFFFFF] font-mono">{gaugeVal}%</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#8A8A90]">Target Goal: {config.customGoal || 85}%</span>
        </div>
      );

    case 'funnel':
      return (
        <div className="h-full flex flex-col justify-center space-y-2 p-2 font-mono">
          {data.map((item, idx) => {
            const widthPct = Math.max(25, 100 - idx * 22);
            return (
              <div
                key={idx}
                onClick={() => handlePointClick(item)}
                className="cursor-pointer group flex items-center gap-3 text-xs"
              >
                <span className="text-[10px] text-[#8A8A90] w-28 truncate">{String(item.stage)}</span>
                <div className="flex-1 bg-[#1B1B1E] h-7 rounded-lg overflow-hidden border border-[#2D2D31] p-0.5 relative flex items-center justify-center">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[#3B82F6] to-[#62DF7D] group-hover:brightness-125 transition-all"
                    style={{ width: `${widthPct}%` }}
                  />
                  <span className="absolute font-bold text-[11px] text-[#FFFFFF] drop-shadow">
                    {Number(item.count).toLocaleString()} ({String(item.pct)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'waterfall':
      return (
        <div className="h-full flex flex-col justify-between p-2 font-mono text-xs">
          <div className="grid grid-cols-6 gap-2 h-full items-end pt-4 pb-2 border-b border-[#2D2D31]">
            {data.map((item, idx) => {
              const amt = Number(item.amount);
              const isPositive = amt >= 0;
              const barHeight = Math.min(100, Math.max(20, Math.abs(amt) / 4));
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                  <span className="text-[10px] font-bold text-[#FFFFFF]">
                    {isPositive ? `+${amt}` : amt}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all group-hover:brightness-125 ${
                      idx === 0 || idx === data.length - 1
                        ? 'bg-[#3B82F6]'
                        : isPositive
                        ? 'bg-[#10B981]'
                        : 'bg-[#EF4444]'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[9px] text-[#8A8A90] text-center truncate w-full">{String(item.item)}</span>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'sankey':
      return (
        <div className="h-full flex items-center justify-between p-3 font-mono text-xs gap-4">
          <div className="space-y-3 flex-1">
            <div className="p-2.5 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#FFFFFF] text-[11px] font-bold">
              Organic Search (4,500)
            </div>
            <div className="p-2.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#FFFFFF] text-[11px] font-bold">
              Paid Campaign (3,200)
            </div>
          </div>
          <div className="text-[#62DF7D] font-bold text-sm">➔ Flow ➔</div>
          <div className="space-y-3 flex-1">
            <div className="p-2.5 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 text-[#FFFFFF] text-[11px] font-bold">
              Product Landing (5,200)
            </div>
            <div className="p-2.5 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#8A8A90] text-[11px]">
              Bounce Drop (2,500)
            </div>
          </div>
          <div className="text-[#62DF7D] font-bold text-sm">➔ Flow ➔</div>
          <div className="space-y-3 flex-1">
            <div className="p-2.5 rounded-lg bg-[#62DF7D]/30 border border-[#62DF7D] text-[#FFFFFF] text-[11px] font-extrabold">
              Paid Enterprise (2,100)
            </div>
          </div>
        </div>
      );

    case 'heatmap':
      return (
        <div className="h-full flex flex-col justify-center space-y-1.5 p-2 font-mono text-xs">
          {data.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-2">
              <span className="w-8 text-[10px] text-[#8A8A90]">{String(row.day)}</span>
              <div className="flex-1 grid grid-cols-4 gap-1.5">
                {['h08', 'h12', 'h16', 'h20'].map((colKey, cIdx) => {
                  const val = Number(row[colKey]) || 0;
                  const bgOpacity = Math.min(1, Math.max(0.2, val / 100));
                  return (
                    <div
                      key={cIdx}
                      title={`${row.day} ${colKey}: ${val} orders`}
                      className="p-1.5 rounded-md text-center text-[10px] font-bold text-[#FFFFFF] transition-transform hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${bgOpacity})`,
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                      }}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );

    case 'treemap':
      return (
        <div className="h-full grid grid-cols-3 gap-2 p-2 font-mono text-xs">
          {data.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handlePointClick(item)}
              className="p-3 rounded-xl border border-[#2D2D31] bg-[#1B1B1E] hover:border-[#62DF7D] transition-all cursor-pointer flex flex-col justify-between"
              style={{
                gridColumn: idx === 0 ? 'span 2' : 'span 1',
                backgroundColor: colors[idx % colors.length] + '20',
                borderColor: colors[idx % colors.length] + '50',
              }}
            >
              <span className="text-[11px] font-bold text-[#FFFFFF] truncate">{String(item.name)}</span>
              <div className="text-right text-xs font-mono font-extrabold text-[#62DF7D]">
                ${Number(item.value).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return <div className="p-4 text-center text-xs text-[#8A8A90]">Select a valid chart type</div>;
  }
};
