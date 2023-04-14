import { ConfigApi } from '@backstage/core-plugin-api';
import { ErrorResponseBody } from '@backstage/errors';
import { Namespace } from '@janus-idp/plugin-kiali-backend/src/types/';

export const getNamespaces = async (
  configApi: ConfigApi,
): Promise<Namespace[] | ErrorResponseBody> => {
  const backendUrl = configApi.getString('backend.baseUrl');
  const jsonResponse = await fetch(
    `${backendUrl}/api/kiali/namespaces`,
  );
  return jsonResponse.json();
};