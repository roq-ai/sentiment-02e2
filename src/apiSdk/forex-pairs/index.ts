import axios from 'axios';
import queryString from 'query-string';
import { ForexPairInterface, ForexPairGetQueryInterface } from 'interfaces/forex-pair';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getForexPairs = async (
  query?: ForexPairGetQueryInterface,
): Promise<PaginatedInterface<ForexPairInterface>> => {
  const response = await axios.get('/api/forex-pairs', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createForexPair = async (forexPair: ForexPairInterface) => {
  const response = await axios.post('/api/forex-pairs', forexPair);
  return response.data;
};

export const updateForexPairById = async (id: string, forexPair: ForexPairInterface) => {
  const response = await axios.put(`/api/forex-pairs/${id}`, forexPair);
  return response.data;
};

export const getForexPairById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/forex-pairs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteForexPairById = async (id: string) => {
  const response = await axios.delete(`/api/forex-pairs/${id}`);
  return response.data;
};
