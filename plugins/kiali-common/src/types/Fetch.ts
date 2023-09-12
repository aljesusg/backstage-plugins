import {
  AuthInfo,
  ControlPlaneMetricsMap,
  KialiConfigT,
  Metric,
  Namespace,
  NamespaceHealth,
  NamespaceInfo,
  OverviewData,
  StatusState,
  TLSStatus,
} from '../';

import { AlertMessage } from "@backstage/core-plugin-api";

export type NsMetrics = { [key: string]: Metric[] };
export type HealthNamespace = { [key: string]: NamespaceHealth };

export interface KialiInfo {
  status: StatusState;
  auth: AuthInfo;
}
export type FetchResponse =
  | KialiConfigT
  | KialiInfo
  | OverviewData
  | NamespaceInfo
  | TLSStatus
  | NsMetrics
  | ControlPlaneMetricsMap
  | HealthNamespace
  | Namespace[];


export interface FetchResponseWrapper {
  alerts: AlertMessage[];
  response?: FetchResponse;
}

export type FetchResult = FetchResponse | AlertMessage | number;
