import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

import { Entity } from '@backstage/catalog-model';
import { Content, HeaderTabs, Page } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';

import { getEntityRoutes, getRoutes } from '../src/components/Router';
import { KialiHeader } from '../src/pages/Kiali/Header/KialiHeader';
import { pluginName } from '../src/plugin';
import { kialiApiRef } from '../src/services/Api';
import { KialiProvider } from '../src/store/KialiProvider';
import { MockKialiClient } from './mockApi';
import { mockEntity } from './mockEntity';

const TabsMock = () => {
  const [selectedTab, setSelectedTab] = React.useState<number>(0);
  const tabs = [
    { label: 'Overview', route: `/overview` },
    { label: 'Workloads', route: `/workloads` },
    { label: 'Services', route: `/services` },
    { label: 'Applications', route: `/applications` },
    { label: 'Istio Config', route: `/istio` },
  ];
  const navigate = useNavigate();
  return (
    <HeaderTabs
      selectedIndex={selectedTab}
      onChange={(index: number) => {
        navigate(tabs[index].route);
        setSelectedTab(index);
      }}
      tabs={tabs.map(({ label }, index) => ({
        id: index.toString(),
        label,
      }))}
    />
  );
};

interface Props {
  children?: React.ReactNode;
  entity?: Entity;
  isEntity?: boolean;
}

export const MockProvider = (props: Props) => {
  const content = (
    <KialiProvider entity={props.entity || mockEntity}>
      <BrowserRouter>
        <Page themeId="tool">
          {!props.isEntity && (
            <>
              <KialiHeader />
              <TabsMock />
              {getRoutes(true)}
            </>
          )}
          {props.isEntity && <Content>{getEntityRoutes()}</Content>}
        </Page>
      </BrowserRouter>
    </KialiProvider>
  );

  const viewIfEntity = props.isEntity && (
    <EntityProvider entity={mockEntity}>{content}</EntityProvider>
  );

  return (
    <TestApiProvider apis={[[kialiApiRef, new MockKialiClient()]]}>
      {viewIfEntity || content}
    </TestApiProvider>
  );
};
