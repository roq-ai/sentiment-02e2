import * as yup from 'yup';

export const tradingDataValidationSchema = yup.object().shape({
  buy_percentage: yup.number().integer().required(),
  sell_percentage: yup.number().integer().required(),
  forex_pair_id: yup.string().nullable(),
});
