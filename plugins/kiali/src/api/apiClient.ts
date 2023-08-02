import { Entity } from '@backstage/catalog-model';
import { createApiRef, DiscoveryApi, IdentityApi} from '@backstage/core-plugin-api';
import {   OverviewType,
} from '@janus-idp/backstage-plugin-kiali-common';
import {
  DirectionType,
  FetchResponseWrapper
} from '@janus-idp/backstage-plugin-kiali-common';
import { stringifyEntityRef } from '@backstage/catalog-model';

export interface KialiApi {
  getConfig(): Promise<FetchResponseWrapper>;
  getOverview(overviewType: OverviewType, duration: number, direction: DirectionType): Promise<FetchResponseWrapper>;
  setEntity(entity: Entity): void;
}

export const kialiApiRef = createApiRef<KialiApi>({
  id: 'plugin.kiali.service',
});

/**
 * Query Interface
 */

export const KialiEndpoints = {
  getOverview: '/overview',
  getConfig: '/config',
};

/**
 * Provides A KialiClient class to query backend
 */
export class KialiApiClient implements KialiApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  protected entity: Entity | null;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;}) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.entity = null;
  }

  setEntity = (entity: Entity) => {
    this.entity = entity;
  };
    
  private async getAPI(
    endpoint: string,
    requestBody: any,
  ): Promise<FetchResponseWrapper> {
    const url = `${await this.discoveryApi.getBaseUrl('kiali')}/${endpoint}`;
    // const url = `${proxyUrl}/${endpoint}${this.getQuery(q)}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const jsonResponse = await fetch(url,{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
      body: JSON.stringify(requestBody)}
    );
    return jsonResponse.json();
  }

  async getConfig(): Promise<FetchResponseWrapper> {
    const requestBody = {entityRef: stringifyEntityRef(this.entity!)}
    return this.getAPI(KialiEndpoints.getConfig, requestBody)
  }

  async getOverview(overviewType: OverviewType, duration: number, direction: DirectionType): Promise<FetchResponseWrapper> {
    const requestBody = {
      entityRef: stringifyEntityRef(this.entity!),
      query: {        
          duration,
          overviewType,
          direction,        
      }
    }
    return this.getAPI(KialiEndpoints.getOverview, requestBody)
  }
}
