import { AuthStrategy, CertsInfo, INITIAL_STATUS_STATE, KialiInfo, Namespace, TLSStatus } from '@janus-idp/backstage-plugin-kiali-common';
import { AlertMessage } from "@backstage/core-plugin-api";

export type AlertKialiMessage = AlertMessage & {
    id: number
}   

export type kiali_state_type = {
    info: KialiInfo,
    config: {
        meshTLSStatus?: TLSStatus;
        istioCerts?: CertsInfo[];
        kialiConsole: string;
        username: string;
    },
    alerts: AlertKialiMessage[],
    namespaces: Namespace[],
    activeNamespaces: Namespace[]
}

export const KIALI_INIT_STATE: kiali_state_type = {
    info: { 
        status: INITIAL_STATUS_STATE,
        auth: { sessionInfo: {}, strategy: AuthStrategy.anonymous }
    },
    config: {
        kialiConsole: '',
        username: ''
    },
    alerts: [],
    namespaces: [],
    activeNamespaces: []
}    