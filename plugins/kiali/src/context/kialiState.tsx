import React from 'react';
import { kialiActions } from "./actions";
import { KialiConfigT } from '@janus-idp/backstage-plugin-kiali-common';
import { AlertMessage } from "@backstage/core-plugin-api";

import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { kialiApiRef } from '../services/Api';

import { setServerConfig } from '../config';
import { KialiContext } from "./kialiContext";
import { KialiReducer } from "./kialiReducer";
import { AlertKialiMessage, KIALI_INIT_STATE } from './types';

export const KialiStateProvider = ({ children }) => {    
    
    const [state, dispatch] = React.useReducer(KialiReducer, KIALI_INIT_STATE);

    const kialiClient = useApi(kialiApiRef);
    kialiClient.setEntity(useEntity().entity);

    const addAlert = (alert: AlertMessage[]) => {
        const alerts: AlertKialiMessage[] = [...state.alerts]
        alert.forEach( al => alerts.push({...al, id: alerts.length}))       
        dispatch({type: kialiActions.SET_ALERTS, payload: alerts})
    }

    const removeAlert = (id: number) => {
        const alerts: AlertKialiMessage[] = [...state.alerts.filter(al => al.id !== id)]
        dispatch({type: kialiActions.SET_ALERTS, 
            payload: alerts.filter(al => al.id !== id)
        })        
    }
    
    const getConfig = async() => {
        if (state.config.kialiConsole === '') {
            await kialiClient.getConfig().then(resp => {
                if (resp.alerts.length > 0) {
                    addAlert(resp.alerts);
                }
                var newConfig = resp.response as KialiConfigT;
                setServerConfig(newConfig.server!)
                dispatch({type: kialiActions.SET_CONFIG, payload: newConfig})                
            });
        }
    }

    const getInfo = async() => {
        if(!state.info.status.status['Kiali version']) {
          await kialiClient.getInfo().then(resp => {
            if (resp.alerts.length > 0) {
                addAlert(resp.alerts);
            } else {
              dispatch({type: kialiActions.SET_INFO, payload: resp.response}) 
            }
          });
        }
    }

    const getNamespaces = async() => {
        await kialiClient.getNamespaces().then(resp => {
            if (resp.alerts.length > 0) {
                addAlert(resp.alerts);
            }
            dispatch({type: kialiActions.SET_NAMESPACES, payload: resp.response})
            dispatch({type: kialiActions.SET_ACTIVE_NAMESPACES, payload: resp.response})            
          });
    }

    const setActiveNamespaces = (actNS: string[]) => {
        dispatch({type: kialiActions.SET_ACTIVE_NAMESPACES, 
            payload: state.namespaces.filter(ns => actNS.indexOf(ns.name) >= 0 )        
        })            

    }

    const loadConfig = async() => {
        await getInfo()
        await getConfig()
        await getNamespaces()
    }

    React.useEffect(() => {
        loadConfig();
    }, []);

    return <KialiContext.Provider value={
        {
            ...state, 
            addAlert,
            removeAlert,
            setActiveNamespaces
        }
    }>{children}</KialiContext.Provider>;
}