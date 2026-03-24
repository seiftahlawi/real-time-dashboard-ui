import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { Ticker } from "../types";
import type { PricePoint } from "../hooks/useLivePrices";

interface Props {
  ticker: Ticker;
  logo: string;
  history: PricePoint[];
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function PriceChart({ ticker, logo, history }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[20vw] text-gray-500 text-sm">
        Waiting for data…
      </div>
    );
  }

  const priceValues = history.map((p) => p.price);
  const min = Math.min(...priceValues);
  const max = Math.max(...priceValues);
  const pad = (max - min) * 0.2 || 2;
  const domain: [number, number] = [min - pad, max + pad];

  const first = history[0].price;
  const last = history[history.length - 1].price;
  const isUp = last >= first;
  const color = isUp ? "#22c55e" : "#ef4444";
  const change = last - first;
  const changePct = ((change / first) * 100).toFixed(2);

  return (
    <div className="flex flex-col lg:h-full gap-4 lg:gap-[1vw]">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-[0.6vw]">
          {logo && <img src={logo} alt={ticker} className="w-8 h-auto lg:w-[3vw]  rounded-full shrink-0" />}
          <div>
            <p className="text-base lg:text-[1.25vw] lg:leading-[1.667vw] font-bold text-white">{ticker}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl lg:text-[1.6vw] font-bold text-white leading-tight">${last.toFixed(2)}</p>
          <p className={`text-xs lg:text-[0.729vw] font-semibold mt-0.5 ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "▲" : "▼"} ${Math.abs(change).toFixed(2)} ({changePct}%)
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-92 lg:flex-1 lg:h-auto lg:min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={domain}
              tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              width={55}
              tickCount={5}
              orientation="right"
            />
            <ReferenceLine y={first} stroke="#374151" strokeDasharray="4 4" strokeWidth={1} />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
              labelFormatter={(ts) => formatTime(Number(ts))}
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "10px",
                color: "#f9fafb",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotoneX"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${ticker})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
