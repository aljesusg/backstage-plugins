import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { readKialiConfigs } from '../helpers/config';
import { KialiApiImpl } from '../clients/KialiAPIConnector';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export const makeRouter = (
  logger: Logger,
  kialiAPI: KialiApiImpl,
): express.Router => {
  
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/namespaces', async (_, response) => {
    logger.info('Call to Namespaces');
    kialiAPI.fetchNamespaces().then(resp => {response.json(resp)}).catch(err => logger.error(err))   
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

  logger.info('Initializing Kiali backend');

  const kiali = readKialiConfigs(config);

  const kialiAPI = new KialiApiImpl({logger, kiali})

  return makeRouter(logger, kialiAPI)
}
