import { KialiEndpoints, Namespace } from '../types/';
import { Logger } from 'winston';

export type Options = {
    logger: Logger;
    kiali: Kiali;
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

    constructor(options: Options) {
        options.logger.debug(
          `creating kiali client with url=${options.kiali.url}`,
        );
    
        this.kiali = options.kiali
        this.logger = options.logger;
    }

    async fetchNamespaces(): Promise<Namespace[]> {
        const url = new URL(KialiEndpoints.namespaces, this.kiali.url).href;
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