import React from 'react';
import { KialiContext } from "../../context";
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';

import { CircularProgress, Grid } from '@material-ui/core';

import {
  CanaryUpgradeStatus,
  ComponentStatus,
  IstiodResourceThresholds,
  KialiConfigT,
  Namespace,
  NamespaceInfo,
  OutboundTrafficPolicy,
  OverviewData,
  OverviewType,
} from '@janus-idp/backstage-plugin-kiali-common';

import { kialiApiRef } from '../../services/Api';
import { calculateHealth } from './health';
import { OverviewCard } from './OverviewCard';
import { OverviewToolbar } from './OverviewToolbar';
import { NoData } from '../NoData';

export declare enum OverviewDisplayMode {
  COMPACT = 0,
  EXPAND = 1,
  LIST = 2,
}

declare const directionTypes: {
  inbound: string;
  outbound: string;
};
export type DirectionType = keyof typeof directionTypes;

export const Overview = () => {
  const { activeNamespaces, addAlert, info, config } = React.useContext(KialiContext); 
  const kialiClient = useApi(kialiApiRef);
  kialiClient.setEntity(useEntity().entity);
  const [namespaces, setNamespaces] = React.useState<NamespaceInfo[]>([]);
  const [canaryStatus, setCanaryStatus] = React.useState<
    CanaryUpgradeStatus | undefined
  >(undefined);
  const [canaryUpgrade, setCanaryUpgrade] = React.useState<boolean>(false);
  const [componentStatus, setComponentStatus] = React.useState<
    ComponentStatus[]
  >([]);
  const [direction, setDirection] = React.useState<DirectionType>('inbound');
  const [duration, setDuration] = React.useState<number>(600);
  const [overviewType, setOverviewType] = React.useState<OverviewType>('app');
  const [outboundTrafficPolicy, setoutboundTrafficPolicy] =
    React.useState<OutboundTrafficPolicy>({ mode: '' });
  const [istiodResourceThresholds, setIstiodResourceThresholds] =
    React.useState<IstiodResourceThresholds | undefined>(undefined);

  const fetchOverview = async (
    kialiConfig: KialiConfigT = config,
    dur: number = duration,
    ovType: OverviewType = overviewType,
    dir: DirectionType = direction,
  ) => {
    await kialiClient
      .getOverview(ovType, dur, dir)
      .then(response => {
        if (response.alerts.length > 0) {
          addAlert(response.alerts)
        } else {
          const ovData = response.response as OverviewData;
          const ns = ovData.namespaces;
          
          try {
            if (ns.length > 0) {
              ns.forEach((n, i) => {
                ns[i] = calculateHealth(ovType, n, dur);
              });
            } else {
              addAlert([{
                severity: 'warning',
                message: `[SYSTEM_ERROR]No namespaces for Health`,
              }])
            }
          } catch (e) {
            addAlert([{
              severity: 'warning',
              message: `[SYSTEM_ERROR]Error calculating Health : ${e}`,
            }])
          }          
          setNamespaces(ns);
          setIstiodResourceThresholds(ovData.istiodResourceThresholds);
          setoutboundTrafficPolicy(ovData.outboundTraffic || { mode: '' });
          setComponentStatus(ovData.istioStatus || []);
          setCanaryStatus(ovData.canaryUpgrade);
          setCanaryUpgrade(
            ovData.canaryUpgrade!.pendingNamespaces.length > 0 ||
              ovData.canaryUpgrade!.migratedNamespaces.length > 0,
          );
        }
      })
      .catch(e => {
        addAlert([{
          severity: 'warning',
          message: `[SYSTEM_ERROR]Error calculating Health : ${e}`,
        }])
      });
  };

  const [{ loading }, refresh] = useAsyncFn(
    async () => {
      // Check if the config is loaded
      await fetchOverview();
    },
    [duration, overviewType, direction],
    { loading: true },
  );
  useDebounce(refresh, 10);

  if (loading) {
    return <CircularProgress />;
  }

  const handleToolbar = (
    dur: number = duration,
    ovType: OverviewType = overviewType,
    dir: DirectionType = direction,
  ) => {
    fetchOverview(config, dur, ovType, dir);
    setDuration(dur);
    setOverviewType(ovType);
    setDirection(dir);
  };
  return (
    <>      
      {namespaces.length > 0 ? (
        <>
          <OverviewToolbar
            refresh={() => handleToolbar(duration, overviewType, direction)}
            duration={duration}
            setDuration={e => handleToolbar(e, overviewType, direction)}
            overviewType={overviewType}
            setOverviewType={e => handleToolbar(duration, e, direction)}
            direction={direction}
            setDirection={e => handleToolbar(duration, overviewType, e)}
          />
          <Grid container direction="column">
            {namespaces.map(
              (ns, _) =>
                  activeNamespaces.map((ns: Namespace) => ns.name).indexOf(ns.name) > -1 && (
                  <OverviewCard
                    key={`${ns.cluster}_${ns.name}`}
                    canaryStatus={canaryStatus}
                    canaryUpgrade={canaryUpgrade}
                    direction={direction}
                    duration={duration}
                    ns={ns}
                    outboundTrafficPolicy={outboundTrafficPolicy}
                    kialiConfig={config}
                    type={overviewType}
                    istioAPIEnabled={
                      info.status.istioEnvironment.istioAPIEnabled
                    }
                    istiodResourceThresholds={istiodResourceThresholds}
                    istioStatus={componentStatus}
                  />
                ),
            )}
          </Grid>
        </>
      ): (
        <NoData title="No namespaces found" description="There are some errors or no namespaces with annotation"/>
      )}
    </>
  );
};
