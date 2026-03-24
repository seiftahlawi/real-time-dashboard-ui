import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function PriceChart({ ticker, logo, history }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-sm">
        Waiting for data…
      </div>
    );
  }

  const prices = history.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1 || 1;
  const domain: [number, number] = [minPrice - padding, maxPrice + padding];

  const first = history[0].price;
  const last = history[history.length - 1].price;
  const isUp = last >= first;
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-3 mb-4">
        <img
          src={logo}
          alt={ticker}
          width={36}
          height={36}
          className="rounded-full w-8 lg:w-[2vw] shrink-0"
        />
        <div className="flex items-baseline gap-2 lg:gap-3 flex-1">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white font-mono">
            ${last.toFixed(2)}
          </h2>
          <span className={`text-sm font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
            {isUp ? "▲" : "▼"} ${Math.abs(last - first).toFixed(2)} ({((last - first) / first * 100).toFixed(2)}%)
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{ticker}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={history} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <defs>
            <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={domain}
            tickFormatter={formatPrice}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
            labelFormatter={(ts) => formatTime(Number(ts))}
            contentStyle={{
              backgroundColor: "rgba(17,24,39,0.9)",
              border: "none",
              borderRadius: "8px",
              color: "#f9fafb",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${ticker})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
