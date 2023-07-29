import { ForexPairInterface } from 'interfaces/forex-pair';
import { GetQueryInterface } from 'interfaces';

export interface TradingDataInterface {
  id?: string;
  buy_percentage: number;
  sell_percentage: number;
  forex_pair_id?: string;
  created_at?: any;
  updated_at?: any;

  forex_pair?: ForexPairInterface;
  _count?: {};
}

export interface TradingDataGetQueryInterface extends GetQueryInterface {
  id?: string;
  forex_pair_id?: string;
}
