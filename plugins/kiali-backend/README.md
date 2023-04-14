# kiali

Welcome to the kiali backend plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn
start` in the root directory, and then navigating to [/kiali](http://localhost:3000/kiali).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](/dev) directory.


## Setup

To actually attach and run the plugin router, you will make some modifications to your backend

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @janus-idp/plugin-kiali-backend@^0.1.0 # Change this to match the plugin's package.json
```


Create a new file named `packages/backend/src/plugins/kiali.ts` and add the following to it

```ts
import { createRouter } from '@janus-idp/plugin-kiali-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger: env.logger,
  });
}

```

And finally, wire this into the overall backend router. Edit `packages/backend/src/index.ts`

```ts
import kiali from './plugins/kiali';
// ...
async function main() {
  // ...
  const kialiEnv = useHotMemoize(module, () => createEnv('kiali'));
  apiRouter.use('/kiali', await kiali(kialiEnv));

```

After you start the backend (e.g. using yarn start-backend from the repo root), you should be able to fetch data from it.

# Note the extra /api here
curl localhost:7007/api/kiali/health


This should return {"status":"ok"} like before. Success!



app-config.yaml

```yaml
catalog:
  providers:
    kiali:
      env: # Key is reflected as provider ID. Defines and claims plugin instance ownership of entities
        url: # Url of the kiali API endpoint
        serviceAccountToken: # Token used for querying data
        skipTLSVerify: # Skip TLS certificate verification, defaults to false

```