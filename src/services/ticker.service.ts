import axios, { AxiosError } from "axios";
import type { TickerInfo } from "../types";

const BASE_URL = "http://localhost:3000";

export const getTickers = async () => {
  let response;
  try {
    response = await axios.get<TickerInfo[]>(`${BASE_URL}/tickers`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError;
      if (serverError && serverError.response) {
        return serverError.response;
      }
    }
    return { data: { message: JSON.stringify(error) }, status: -1 };
  }
  return response;
};
