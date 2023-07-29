import axios from 'axios';
import queryString from 'query-string';
import { TradingDataInterface, TradingDataGetQueryInterface } from 'interfaces/trading-data';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getTradingData = async (
  query?: TradingDataGetQueryInterface,
): Promise<PaginatedInterface<TradingDataInterface>> => {
  const response = await axios.get('/api/trading-data', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createTradingData = async (tradingData: TradingDataInterface) => {
  const response = await axios.post('/api/trading-data', tradingData);
  return response.data;
};

export const updateTradingDataById = async (id: string, tradingData: TradingDataInterface) => {
  const response = await axios.put(`/api/trading-data/${id}`, tradingData);
  return response.data;
};

export const getTradingDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trading-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTradingDataById = async (id: string) => {
  const response = await axios.delete(`/api/trading-data/${id}`);
  return response.data;
};
