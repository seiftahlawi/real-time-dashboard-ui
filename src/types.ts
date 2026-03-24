export type Ticker = "AAPL" | "TSLA" | "BTC-USD";

export interface PriceUpdate {
  ticker: Ticker;
  price: number;
  timestamp: number;
}

export interface TickerInfo {
  ticker: Ticker;
  logo: string;
}
