import axios from 'axios';
import queryString from 'query-string';
import { BrokerInterface, BrokerGetQueryInterface } from 'interfaces/broker';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBrokers = async (query?: BrokerGetQueryInterface): Promise<PaginatedInterface<BrokerInterface>> => {
  const response = await axios.get('/api/brokers', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBroker = async (broker: BrokerInterface) => {
  const response = await axios.post('/api/brokers', broker);
  return response.data;
};

export const updateBrokerById = async (id: string, broker: BrokerInterface) => {
  const response = await axios.put(`/api/brokers/${id}`, broker);
  return response.data;
};

export const getBrokerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/brokers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBrokerById = async (id: string) => {
  const response = await axios.delete(`/api/brokers/${id}`);
  return response.data;
};
