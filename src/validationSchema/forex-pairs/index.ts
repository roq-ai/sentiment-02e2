import * as yup from 'yup';

export const forexPairValidationSchema = yup.object().shape({
  pair_name: yup.string().required(),
  broker_id: yup.string().nullable(),
});
