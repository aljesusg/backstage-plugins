import React from 'react';

import { createDevApp } from '@backstage/dev-utils';
import { TestApiProvider } from '@backstage/test-utils';

import { KialiPage, kialiPlugin } from '../src';
import { KialiNoAnnotation } from '../src/pages/Kiali/KialiNoAnnotation';
import { KialiNoResources } from '../src/pages/Kiali/KialiNoResources';
import { ServiceListPage } from '../src/pages/ServiceList/ServiceListPage';
import { kialiApiRef } from '../src/services/Api';
import { MockKialiClient } from './mockApi';
import { mockEntityAnnotationNoNamespace } from './mockEntity';
import { MockProvider } from './mockProvider';
/* Components */
import { MockKialiError } from './pages/kialiError';

createDevApp()
  .registerPlugin(kialiPlugin)
  .addPage({
    element: (
      <TestApiProvider apis={[[kialiApiRef, new MockKialiClient()]]}>
        <KialiPage />
      </TestApiProvider>
    ),
    title: 'Kiali Page',
    path: `/kiali`,
  })
  .addPage({
    element: <MockKialiError />,
    title: 'Kiali error',
    path: `/kiali-error`,
  })
  .addPage({
    element: <KialiNoResources entity={mockEntityAnnotationNoNamespace} />,
    title: 'No resource',
    path: '/no-resource',
  })
  .addPage({
    element: <KialiNoAnnotation />,
    title: 'No Annotation',
    path: '/no-annotation',
  })
  .addPage({
    element: <ServiceListPage />,
    path: '/services',
  })
  .render();
