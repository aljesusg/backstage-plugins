import React, { useState } from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import { ErrorResponseBody } from '@backstage/errors';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { getNamespaces } from '../../helpers/apiClient';
import { Namespace } from '@janus-idp/plugin-kiali-backend/src/types/';

type DenseTableProps = {
  namespaces: Namespace[];
};

export const DenseTable = ({ namespaces }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' }
  ];

  const data = namespaces.map(ns => {
    return {      
      name: ns.name
    };
  });

  return (
    <Table
      title="Example Overview Namespaces Poc"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const ExampleFetchComponent = () => {
  const configApi = useApi(configApiRef);

  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [{ loading, error }, refresh] = useAsyncFn(async () => {
    const namespaces = await getNamespaces(configApi);
    if ('error' in namespaces) {
      throw new Error((namespaces as ErrorResponseBody).error.message);
    }
    setNamespaces(namespaces)
    
  }, [], { loading: true },);
  useDebounce(refresh, 10);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable namespaces={namespaces || []} />;
};
