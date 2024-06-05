import { Content, InfoCard, Page } from '@backstage/core-components';

import { Grid } from '@material-ui/core';

import { KialiHelper } from '../../src/pages/Kiali/KialiHelper';
import {
  KialiChecker,
  ValidationCategory,
} from '../../src/store/KialiProvider';

export const MockKialiError = () => {
  const errorsTypes: KialiChecker[] = [
    {
      verify: false,
      title: 'Error reaching Kiali',
      message: ' Error status code 502',
      category: ValidationCategory.networking,
      helper: 'Check if http://kialiendpoint works',
    },
    {
      verify: false,
      title: 'Authentication failed. Missing Configuration',
      message: `Attribute 'serviceAccountToken' is not in the backstage configuration`,
      category: ValidationCategory.configuration,
      helper: 'Check if http://kialiendpoint works',
      missingAttributes: ['serviceAccountToken'],
    },
    {
      verify: false,
      title: 'Authentication failed. Not supported',
      message: `Strategy oauth2 is not supported in Kiali backstage plugin yet`,
      category: ValidationCategory.configuration,
    },
    {
      verify: false,
      title: 'Authentication failed',
      message: `We can't authenticate`,
      category: ValidationCategory.authentication,
    },
    {
      verify: false,
      title: 'Unkown error ',
      message: `Internal error`,
      category: ValidationCategory.unknown,
    },
    {
      verify: false,
      title: 'kiali version not supported',
      message: `Kiali version supported is v1.74, we found version v1.80`,
      category: ValidationCategory.versionSupported,
    },
    {
      verify: true,
      title: 'True verification, we not expect something',
      category: ValidationCategory.unknown,
    },
  ];

  return (
    <Page themeId="tool">
      <Content data-test="Kiali Errors">
        <Grid container direction="column">
          {errorsTypes.map(error => (
            <Grid item>
              <InfoCard
                title={`Error type : ${error.category} -- ${error.title}`}
              >
                <KialiHelper check={error} />
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
