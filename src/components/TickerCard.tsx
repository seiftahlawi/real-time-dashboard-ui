import type { Ticker } from "../types";
import type { TickerState } from "../hooks/useLivePrices";

interface Props {
  ticker: Ticker;
  logo: string;
  state: TickerState | undefined;
  selected: boolean;
  onClick: () => void;
}

const LABELS: Record<Ticker, string> = {
  AAPL: "Apple Inc.",
  TSLA: "Tesla Inc.",
  "BTC-USD": "Bitcoin",
};

export default function TickerCard({ ticker, logo, state, selected, onClick }: Props) {
  const price = state?.price ?? 0;
  const change = price - (state?.prevPrice ?? price);
  const isUp = change >= 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt={ticker} width={28} height={28} className="rounded-full shrink-0" />
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{ticker}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{LABELS[ticker]}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono font-semibold text-gray-900 dark:text-white text-sm">
            {price === 0 ? "—" : `$${price.toFixed(2)}`}
          </p>
          {price !== 0 && change !== 0 && (
            <p className={`text-xs font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
              {isUp ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
