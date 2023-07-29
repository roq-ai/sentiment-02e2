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
  Center,
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
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getForexPairById, updateForexPairById } from 'apiSdk/forex-pairs';
import { forexPairValidationSchema } from 'validationSchema/forex-pairs';
import { ForexPairInterface } from 'interfaces/forex-pair';
import { BrokerInterface } from 'interfaces/broker';
import { getBrokers } from 'apiSdk/brokers';

function ForexPairEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<ForexPairInterface>(
    () => (id ? `/forex-pairs/${id}` : null),
    () => getForexPairById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ForexPairInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateForexPairById(id, values);
      mutate(updated);
      resetForm();
      router.push('/forex-pairs');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ForexPairInterface>({
    initialValues: data,
    validationSchema: forexPairValidationSchema,
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
              label: 'Forex Pairs',
              link: '/forex-pairs',
            },
            {
              label: 'Update Forex Pair',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Forex Pair
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.pair_name}
            label={'Pair Name'}
            props={{
              name: 'pair_name',
              placeholder: 'Pair Name',
              value: formik.values?.pair_name,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<BrokerInterface>
            formik={formik}
            name={'broker_id'}
            label={'Select Broker'}
            placeholder={'Select Broker'}
            fetcher={getBrokers}
            labelField={'name'}
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
              onClick={() => router.push('/forex-pairs')}
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
    entity: 'forex_pair',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ForexPairEditPage);
