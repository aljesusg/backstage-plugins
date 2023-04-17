import { CatalogApi } from '@backstage/catalog-client';
import { Logger } from 'winston';
import { Namespace } from '@janus-idp/plugin-kiali-common';
import { useEntity } from '@backstage/plugin-catalog-react';
import { KIALI_ENDPOINTS } from '../types/'

export type Options = {
    logger: Logger;
    kiali: Kiali;
    catalogApi: CatalogApi;
};

export type Kiali = {
    url: string;
}

export interface KialiApi {
    fetchNamespaces(): Promise<Namespace[]>;
}

export class KialiApiImpl implements KialiApi {
    private readonly logger: Logger;
    private readonly kiali: Kiali;
    private readonly catalogApi: CatalogApi;

    constructor(options: Options) {
        options.logger.debug(
          `creating kiali client with url=${options.kiali.url}`,
        );
    
        this.kiali = options.kiali
        this.logger = options.logger;
        this.catalogApi = options.catalogApi;
        const entity = useEntity()
        console.log(entity)
    }

    async fetchNamespaces(): Promise<Namespace[]> {
        const url = new URL(KIALI_ENDPOINTS.namespaces, this.kiali.url).href;

        this.logger.debug(`Fetching namespaces ` + url);
        return fetch(
            url
        ).then(resp => {
            return resp.json() as Promise<Namespace[]>
        }).catch(error => {
            throw new Error(error)
            return [];
        });
    }
}