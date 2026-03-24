export interface PriceUpdate {
  ticker: string;
  price: number;
  timestamp: number;
}

export interface TickerInfo {
  ticker: string;
  label: string;
  logo: string;
}
