import { TradingDataInterface } from 'interfaces/trading-data';
import { BrokerInterface } from 'interfaces/broker';
import { GetQueryInterface } from 'interfaces';

export interface ForexPairInterface {
  id?: string;
  pair_name: string;
  broker_id?: string;
  created_at?: any;
  updated_at?: any;
  trading_data?: TradingDataInterface[];
  broker?: BrokerInterface;
  _count?: {
    trading_data?: number;
  };
}

export interface ForexPairGetQueryInterface extends GetQueryInterface {
  id?: string;
  pair_name?: string;
  broker_id?: string;
}
