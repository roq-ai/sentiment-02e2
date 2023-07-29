import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createTradingData } from 'apiSdk/trading-data';
import { tradingDataValidationSchema } from 'validationSchema/trading-data';
import { ForexPairInterface } from 'interfaces/forex-pair';
import { getForexPairs } from 'apiSdk/forex-pairs';
import { TradingDataInterface } from 'interfaces/trading-data';

function TradingDataCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TradingDataInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTradingData(values);
      resetForm();
      router.push('/trading-data');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TradingDataInterface>({
    initialValues: {
      buy_percentage: 0,
      sell_percentage: 0,
      forex_pair_id: (router.query.forex_pair_id as string) ?? null,
    },
    validationSchema: tradingDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Trading Data',
              link: '/trading-data',
            },
            {
              label: 'Create Trading Data',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Trading Data
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Buy Percentage"
            formControlProps={{
              id: 'buy_percentage',
              isInvalid: !!formik.errors?.buy_percentage,
            }}
            name="buy_percentage"
            error={formik.errors?.buy_percentage}
            value={formik.values?.buy_percentage}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('buy_percentage', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Sell Percentage"
            formControlProps={{
              id: 'sell_percentage',
              isInvalid: !!formik.errors?.sell_percentage,
            }}
            name="sell_percentage"
            error={formik.errors?.sell_percentage}
            value={formik.values?.sell_percentage}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('sell_percentage', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<ForexPairInterface>
            formik={formik}
            name={'forex_pair_id'}
            label={'Select Forex Pair'}
            placeholder={'Select Forex Pair'}
            fetcher={getForexPairs}
            labelField={'pair_name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/trading-data')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'trading_data',
    operation: AccessOperationEnum.CREATE,
  }),
)(TradingDataCreatePage);
