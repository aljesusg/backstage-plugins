import React from 'react';

import { CardHeader, Chip, Grid } from '@material-ui/core';

import {
  CanaryUpgradeStatus,
  ComponentStatus,
  NamespaceInfo,
} from '@janus-idp/backstage-plugin-kiali-common';

import { IstioStatus } from './IstioStatus';
import { isIstioNamespace } from '../../../../config';

type OverviewCardHeaderProps = {
  ns: NamespaceInfo;
  canaryUpgrade?: boolean;
  canaryStatus?: CanaryUpgradeStatus;
  istioStatus?: ComponentStatus[];
  istioAPIEnabled?: boolean;
};

const getTitleHeader = (
  ns: NamespaceInfo,
  istioStatus?: ComponentStatus[],
  istioAPIEnabled?: boolean,
  hasCanaryUpgradeConfigured?: boolean,
  canaryStatus?: CanaryUpgradeStatus,
) => {
  const istioNamespace = isIstioNamespace(ns.name)
  return (
    <Grid container spacing={1}>
      <Grid item>
        <span
          title={ns.name}
          style={{ display: 'inline-block', verticalAlign: 'middle' }}
        >
          {ns.name}
        </span>
      </Grid>
      {istioNamespace && istioStatus && (
        <>
          <Grid item>
            <Chip
              label="Control plane"
              size="small"
              style={{ backgroundColor: '#f3faf2', color: '#1e4f18' }}
            />
          </Grid>
          <Grid item>
            <IstioStatus istioStatus={istioStatus} />
          </Grid>
        </>
      )}
      {istioNamespace &&
        hasCanaryUpgradeConfigured &&
        canaryStatus?.migratedNamespaces.includes(ns.name) && (
          <Grid item>
            <Chip
              label={canaryStatus?.currentVersion}
              size="small"
              color="primary"
            />
          </Grid>
        )}
      {istioNamespace && !istioAPIEnabled && (
        <Grid item>
          <Chip label="Istio API disabled" size="small" color="secondary" />
        </Grid>
      )}
    </Grid>
  );
};

export const OverviewCardHeader = (props: OverviewCardHeaderProps) => {
  return (
    <CardHeader
      title={getTitleHeader(
        props.ns,
        props.istioStatus,
        props.istioAPIEnabled,
        props.canaryUpgrade,
        props.canaryStatus,
      )}
    />
  );
};
