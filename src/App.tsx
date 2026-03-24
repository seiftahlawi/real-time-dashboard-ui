import { useState } from "react";
import { useLivePrices } from "./hooks/useLivePrices";
import TickerCard from "./components/TickerCard";
import PriceChart from "./components/PriceChart";
import StatusBadge from "./components/StatusBadge";
import type { Ticker } from "./types";

export default function App() {
  const { prices, tickerInfos, connected } = useLivePrices();
  const [selected, setSelected] = useState<Ticker>("AAPL");

  const selectedLogo = tickerInfos.find((t) => t.ticker === selected)?.logo ?? "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 lg:px-[1.25vw] py-4 lg:py-[0.833vw]">
        <div className="max-w-[60vw] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-[0.625vw]">
            <span className="text-xl lg:text-[1.25vw] lg:leading-[1.25vw] font-bold tracking-tight">Market Dashboard</span>
          </div>
          <StatusBadge connected={connected} />
        </div>
      </header>

        <main className="max-w-[60vw] mx-auto px-4 lg:px-[1.25vw] py-6 lg:py-[1.25vw]  flex flex-col lg:flex-row gap-6 lg:gap-[1.25vw]">
        <aside className="lg:w-[15vw] shrink-0">
          <h2 className="text-xs lg:text-[0.725vw] leading-[0.759vw] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 lg:mb-[0.625vw] px-1 lg:px-[0.208vw]">
            Tickers
          </h2>
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-1 lg:overflow-x-visible lg:pb-0 snap-x snap-mandatory scrollbar-none">
            {tickerInfos.map(({ ticker, logo }) => (
              <div key={ticker} className="snap-start shrink-0 w-64 lg:w-auto">
                <TickerCard
                  ticker={ticker}
                  logo={logo}
                  state={prices[ticker]}
                  selected={selected === ticker}
                  onClick={() => setSelected(ticker)}
                />
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3 lg:p-[1.25vw] shadow-sm">
          <PriceChart ticker={selected} logo={selectedLogo} history={prices[selected]?.history ?? []} />
        </section>
      </main>
    </div>
  );
}
