import { useState } from "react";
import { useLivePrices } from "./hooks/useLivePrices";
import TickerCard from "./components/TickerCard";
import PriceChart from "./components/PriceChart";
import StatusBadge from "./components/StatusBadge";
export default function App() {
  const { prices, tickerInfos, connected } = useLivePrices();
  const [selected, setSelected] = useState<string>("AAPL");

  const selectedLogo = tickerInfos.find((t) => t.ticker === selected)?.logo ?? "";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 lg:px-[1.25vw] py-4 lg:py-[0.833vw]">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-xl lg:text-[1.25vw] lg:leading-[1.25vw] font-bold tracking-tight">Market Dashboard</span>
          <StatusBadge connected={connected} />
        </div>
      </header>

      <main className="container mx-auto  py-8  lg:py-[3.333vw]  justify-center  flex flex-col lg:flex-row gap-6 lg:gap-[1.25vw]">
    
        <aside className="lg:w-[19vw]  lg:px-[1.25vw] shrink-0 lg:h-[38vw] lg:overflow-y-auto scrollbar-thin">
         
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-thin pb-1 lg:pb-0 snap-x lg:snap-none snap-mandatory ">
            {tickerInfos.map(({ ticker, label, logo }) => (
              <div key={ticker} className="snap-start shrink-0 w-64 lg:w-auto">
                <TickerCard
                  ticker={ticker}
                  label={label}
                  logo={logo}
                  state={prices[ticker]}
                  selected={selected === ticker}
                  onClick={() => setSelected(ticker)}
                />
              </div>
            ))}
      
          </div>
        </aside>

        <section className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 lg:p-[1.25vw] shadow-sm  lg:h-[38vw] flex flex-col outline-none">
          <PriceChart ticker={selected} logo={selectedLogo} history={prices[selected]?.history ?? []} />
        </section>
      </main>
    </div>
  );
}
