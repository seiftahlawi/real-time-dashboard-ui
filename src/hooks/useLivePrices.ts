import { useCallback, useEffect, useState } from "react";
import type { PriceUpdate, TickerInfo } from "../types";
import { getHistory } from "../services/history.service";
import { getTickers } from "../services/ticker.service";

const WS_URL = "ws://localhost:3000/prices/live";
const MAX_HISTORY = 50;

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface TickerState {
  price: number;
  prevPrice: number;
  history: PricePoint[];
}

export type PriceMap = Record<string, TickerState>;

export function useLivePrices() {
  const [prices, setPrices] = useState<PriceMap>({} as PriceMap);
  const [tickerInfos, setTickerInfos] = useState<TickerInfo[]>([]);
  const [connected, setConnected] = useState(false);

  const loadInitialData = useCallback(async () => {
    const res = await getTickers();
    if (res?.status !== 200) return;
    const tickers = res.data as TickerInfo[];
    setTickerInfos(tickers);

    await Promise.all(
      tickers.map(async ({ ticker }) => {
        const histRes = await getHistory(ticker);
        if (histRes?.status !== 200) return;

        const history = (histRes.data as PriceUpdate[])
          .map(({ timestamp, price }) => ({ timestamp, price }))
          .sort((a, b) => a.timestamp - b.timestamp);

        const last = history.at(-1);
        if (last) setPrices((prev) => ({ ...prev, [ticker]: { price: last.price, prevPrice: last.price, history } }));
      })
    );
  }, []);

  useEffect(() => {
    loadInitialData();

    // WebSocket
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        const update: PriceUpdate = JSON.parse(event.data);
        setPrices((prev) => {
          const current = prev[update.ticker] ?? { price: 0, prevPrice: 0, history: [] };
          const history = [...current.history, { timestamp: update.timestamp, price: update.price }].slice(-MAX_HISTORY);
          return {
            ...prev,
            [update.ticker]: { price: update.price, prevPrice: current.price || update.price, history },
          };
        });
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();

      return ws;
    }

    const ws = connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws.onclose = null;
      ws.close();
    };
  }, []);

  return { prices, tickerInfos, connected };
}
