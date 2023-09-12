import React from 'react';

import { Entity } from '@backstage/catalog-model';
import { createDevApp } from '@backstage/dev-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';
import { AlertMessage } from "@backstage/core-plugin-api";

import {
  FetchResponse,
  FetchResponseWrapper,
} from '@janus-idp/backstage-plugin-kiali-common';

import { KialiApi, kialiApiRef } from '../src/services/Api';
import { KialiPage, kialiPlugin } from '../src/plugin';

import overviewJson from './__fixtures__/1-overview.json';
import configJson from './__fixtures__/config.json';
import namespacesJson from './__fixtures__/namespaces.json';
import statusJson from './__fixtures__/status.json';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'backstage.io/kubernetes-namespace': 'istio-system,bookinfo',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

class MockKialiClient implements KialiApi {
  readonly resource: FetchResponse;
  readonly alerts: AlertMessage[];
  readonly status: FetchResponse;
  readonly config: FetchResponse;
  readonly namespaces: FetchResponse;

  constructor(
    fixtureData: any,
    alerts: AlertMessage[] = [],
    status: any = statusJson,
    config: any = configJson,
    namespaces: any = namespacesJson,
  ) {
    this.resource = fixtureData;
    this.alerts = alerts;
    this.status = status;
    this.config = config;
    this.namespaces = namespaces;
  }

  setEntity(_: Entity): void {}

  async getConfig(): Promise<FetchResponseWrapper> {
    return {
      alerts: this.alerts,
      response: this.config,
    };
  }

  async getNamespaces(): Promise<FetchResponseWrapper> {
    return {
      alerts: this.alerts,
      response: this.namespaces,
    };
  }

  async getInfo(): Promise<FetchResponseWrapper> {
    return {
      alerts: this.alerts,
      response: this.status,
    };
  }

  async getOverview(): Promise<FetchResponseWrapper> {
    return {
      alerts: this.alerts,
      response: this.resource,
    };
  }
}

createDevApp()
  .registerPlugin(kialiPlugin)
  .addPage({
    element: (
      <TestApiProvider
        apis={[[kialiApiRef, new MockKialiClient(overviewJson,[
          {message:'[Error Message] Test', severity: 'error'},
          {message:'[Warning Message] Test', severity: 'warning'},
          {message:'[Warning Message Transient] Test', severity: 'warning', display: 'transient'}
        ])]]}
      >
        <EntityProvider entity={mockEntity}>
          <KialiPage />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'Kiali Plugin Page',
    path: '/kiali',
  })
  .addPage({
    element: (
      <TestApiProvider
        apis={[[kialiApiRef, new MockKialiClient(overviewJson)]]}
      >
        <EntityProvider entity={mockEntity}>
          <KialiPage />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'Overview Page',
    path: '/kiali/overview',
  })
  .addPage({
    element: (
      <TestApiProvider
        apis={[[kialiApiRef, new MockKialiClient(overviewJson)]]}
      >
        <EntityProvider entity={mockEntity}>
          <KialiPage />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'No Path',
    path: '/kiali/noPath',
  })
  .render();
