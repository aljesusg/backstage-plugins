import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'kiali',
});

export const kialiPlugin = createPlugin({
  id: 'kiali',
  routes: {
    root: rootRouteRef,
  },
});

export const KialiPage = kialiPlugin.provide(
  createRoutableExtension({
    name: 'KialiPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);


/**
 * Props of EntityExampleComponent
 *
 * @public
 */
export type EntityKialiContentProps = {
  /**
   * Sets the refresh interval in milliseconds. The default value is 10000 (10 seconds)
   */
  refreshIntervalMs?: number;
};

export const EntityKialiContent: (
  props: EntityKialiContentProps,
) => JSX.Element = kialiPlugin.provide(
  createRoutableExtension({
    name: 'EntityKialiContent',
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);