import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:3000";

export const getHistory = async (ticker: string) => {
  let response;
  try {
    response = await axios.get(`${BASE_URL}/history/${ticker}`);
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
