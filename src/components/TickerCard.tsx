import type { TickerState } from "../hooks/useLivePrices";

interface Props {
  ticker: string;
  label: string;
  logo: string;
  state: TickerState | undefined;
  selected: boolean;
  onClick: () => void;
}

export default function TickerCard({ ticker, label, logo, state, selected, onClick }: Props) {
  const price = state?.price ?? 0;
  const change = price - (state?.prevPrice ?? price);
  const isUp = change >= 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 lg:p-[0.833vw] rounded-xl lg:rounded-[0.625vw] border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-blue-500  bg-blue-900/20 shadow-md"
          : " border-gray-700  bg-gray-800  hover:border-blue-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 lg:gap-[0.521vw]">
          <img src={logo} alt={ticker} width={28} height={28} className="rounded-full h-auto lg:w-[2.5vw] shrink-0" />
          <div>
            <p className="font-bold  text-white text-lg lg:text-[1.042vw] lg:leading-[1.25vw]">{ticker}</p>
            <p className="text-base  text-gray-400 lg:text-[0.833vw] lg:leading-[1.042vw]">{label}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 lg:gap-[0.208vw]">
          <p className="font-semibold  text-white text-base lg:text-[0.833vw] lg:leading-[1.042vw]">
            {price === 0 ? "—" : `$${price.toFixed(2)}`}
          </p>
          {price !== 0 && change !== 0 && (
            <p className={`text-base lg:text-[0.833vw] lg:leading-[1.042vw] font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
              {isUp ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
