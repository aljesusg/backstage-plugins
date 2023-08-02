import {
  CompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { CatalogApi } from '@backstage/catalog-client';
import express, { Request } from 'express';
import { Logger } from 'winston';
import { InputError, AuthenticationError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';


import {
  readKialiConfigs,
} from '@janus-idp/backstage-plugin-kiali-common';

import { KialiApiImpl } from '../clients/KialiAPIConnector';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  catalogApi: CatalogApi;
}

export type OverviewQuery = {
  ns?: string;
  nss?: string[];
  overviewType?: string;
  duration?: number;
  direction?: string;
  annotation?: { [key: string]: string };
};

export const makeRouter = (
  logger: Logger,
  kialiAPI: KialiApiImpl,
  catalogApi: CatalogApi
): express.Router => {

  const getEntityByReq = async (req: Request<any>) => {
    const rawEntityRef = req.body.entityRef;
    if (rawEntityRef && typeof rawEntityRef !== 'string') {
      throw new InputError(`entity query must be a string`);
    } else if (!rawEntityRef) {
      throw new InputError('entity is a required field');
    }
    let entityRef: CompoundEntityRef | undefined = undefined;

    try {
      entityRef = parseEntityRef(rawEntityRef);
    } catch (error) {
      throw new InputError(`Invalid entity ref, ${error}`);
    }

    const token = getBearerTokenFromAuthorizationHeader(
      req.headers.authorization,
    );

    if (!token) {
      throw new AuthenticationError('No Backstage token');
    }
    logger.info(`Token: ${JSON.stringify(token)}`)
    const entity = await catalogApi.getEntityByRef(entityRef, {
      token: token,
    });

    if (!entity) {
      throw new InputError(
        `Entity ref missing, ${stringifyEntityRef(entityRef)}`,
      );
    }    
    return entity;
  };

  /*const getAnnotations = (query: any): { [key: string]: string } => {
    const annotation: { [key: string]: string } = {};
    annotation[KUBERNETES_ANNOTATION] =
      query[encodeURIComponent(KUBERNETES_ANNOTATION)];
    annotation[KUBERNETES_LABEL_SELECTOR] =
      query[encodeURIComponent(KUBERNETES_LABEL_SELECTOR)];
    annotation[KUBERNETES_NAMESPACE] =
      query[encodeURIComponent(KUBERNETES_NAMESPACE)];
    return annotation;
  };*/
  const router = express.Router();
  router.use(express.json());

  router.post('/config', async (req, res) => {
    const entity = await getEntityByReq(req);    
    logger.debug('Call to Configuration');
    const response = await kialiAPI.fetchConfig(entity);
    res.json(response);
  });

  router.post('/overview', async (req, res) => {
    const entity = await getEntityByReq(req);
    /*const query: OverviewQuery = {
      annotation: getAnnotations(req.query),
      duration: Number(req.query.duration) || 600,
      direction: (req.query.direction as string) || 'inbound',
      overviewType: (req.query.overviewType as string) || 'app',
    };*/
    logger.debug('Call to Overview');
    //const response = await kialiAPI.fetchOverviewNamespaces(entity);
    //res.json(response);

    const response = await kialiAPI.fetchConfig(entity);
    res.json(response);
  });

  router.use(errorHandler());
  return router;
};

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const { config } = options;
  const { catalogApi } = options;

  logger.info('Initializing Kiali backend');

  const kiali = readKialiConfigs(config);

  const kialiAPI = new KialiApiImpl({ logger, kiali });

  return makeRouter(logger, kialiAPI, catalogApi);
}
