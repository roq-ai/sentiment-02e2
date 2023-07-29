const mapping: Record<string, string> = {
  brokers: 'broker',
  'forex-pairs': 'forex_pair',
  organizations: 'organization',
  'trading-data': 'trading_data',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
