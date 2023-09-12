import React from 'react';
import {
   useLocation
} from 'react-router-dom';
import { Content, Link, Page, WarningPanel } from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';

import { kialiApiRef } from '../services/Api';
import { rootRouteRef } from '../routes';


const Location = () => {
    const location = useLocation();
    return location.pathname;
};

export const KialiNoPath = () => {
  const kialiClient = useApi(kialiApiRef);
  kialiClient.setEntity(useEntity().entity);
  const link = useRouteRef(rootRouteRef);
  return (
    <Page themeId="tool">
      <Content>
        <WarningPanel
          severity="error"
          title={`Could not find path ${Location()}`}
        >
          Path {Location()} not exist in Kiali Plugin. <Link to={link()}>Go to Kiali Plugin</Link>
        </WarningPanel>
      </Content>
    </Page>
  );
};
