import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TrendChartProps {
  locationId: string | null;
  startDate: number;
  endDate: number;
  metric: "degradation" | "ph" | "microplasticConcentration" | "temperature";
  title: string;
}

export default function TrendChart({ 
  locationId, 
  startDate, 
  endDate, 
  metric, 
  title 
}: TrendChartProps) {
  const trendData = useQuery(api.labData.getTrendData, {
    locationId: locationId ? (locationId as Id<"locations">) : undefined,
    startDate,
    endDate,
  });

  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Tidak ada data untuk periode yang dipilih
        </div>
      </div>
    );
  }

  const values = trendData.map(d => d[metric]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {/* Simple line chart visualization */}
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 32}
              x2="380"
              y2={40 + i * 32}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => {
            const value = maxValue - (i * range / 4);
            return (
              <text
                key={i}
                x="35"
                y={45 + i * 32}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {value.toFixed(1)}
              </text>
            );
          })}
          
          {/* Data line */}
          {trendData.length > 1 && (
            <polyline
              points={trendData.map((d, i) => {
                const x = 40 + (i * 340 / (trendData.length - 1));
                const y = 40 + ((maxValue - d[metric]) / range) * 128;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          )}
          
          {/* Data points */}
          {trendData.map((d, i) => {
            const x = 40 + (i * 340 / Math.max(trendData.length - 1, 1));
            const y = 40 + ((maxValue - d[metric]) / range) * 128;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500">Minimum</div>
          <div className="font-semibold">{minValue.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Maksimum</div>
          <div className="font-semibold">{maxValue.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Rata-rata</div>
          <div className="font-semibold">
            {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
