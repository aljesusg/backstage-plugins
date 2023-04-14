import { Config } from '@backstage/config';
import { KialiConfig } from '../types';

const KIALI_PREFIX = 'catalog.providers.kiali';

const isValidUrl = (url: string): boolean => {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch (error) {
      return false;
    }
    return true;
  };

  export const getFromKialiConfig = (
    config: Config,
  ): Config => {
    // Check if required values are valid
    const requiredValues = ['url'];
    requiredValues.forEach(key => {
      if (!config.has(key)) {
        throw new Error(
          `Value must be specified in config at '${KIALI_PREFIX}.${key}'`,
        );
      }
    });
    return config;
  };
export const getHubClusterFromConfig = (
    config: Config
  ): KialiConfig => {
    const hub = getFromKialiConfig(config);
  
    const url = hub.getString('url');
    if (!isValidUrl(url)) {
      throw new Error(`"${url}" is not a valid url`);
    }
  
    return {
      url,
      serviceAccountToken: hub.getOptionalString('serviceAccountToken'),
      skipTLSVerify: hub.getOptionalBoolean('skipTLSVerify') || false
    };
};

export const readKialiConfigs = (config: Config): KialiConfig => {
    const kialiConfigs = config.getConfig(KIALI_PREFIX);
    return getHubClusterFromConfig(kialiConfigs);    
  };