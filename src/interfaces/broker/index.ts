import { ForexPairInterface } from 'interfaces/forex-pair';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface BrokerInterface {
  id?: string;
  name: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  forex_pair?: ForexPairInterface[];
  organization?: OrganizationInterface;
  _count?: {
    forex_pair?: number;
  };
}

export interface BrokerGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}
