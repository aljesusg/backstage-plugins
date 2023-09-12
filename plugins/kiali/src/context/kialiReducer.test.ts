import {kialiActions} from './actions';
import { KialiReducer } from './kialiReducer';
import { KIALI_INIT_STATE } from './types';

import statusJson from '../../dev/__fixtures__/status.json';
import configJson from '../../dev/__fixtures__/config.json';

describe('Reducer function test', () => {
    test(`should initialize info when ${kialiActions.SET_INFO} action is dispatched`, () => {
      const kialiState = KIALI_INIT_STATE;
      const info = {
        auth: statusJson.auth,
        status: statusJson.status
      }
      const action = {
        type: kialiActions.SET_INFO,
        payload: {
          auth: statusJson.auth,
          status: statusJson.status
        }
      };
  
      const updatedState = KialiReducer(kialiState, action);
  
      expect(updatedState).toEqual({
       ...kialiState,
       info: info
      });
    }); 

    test(`should initialize config when ${kialiActions.SET_CONFIG} action is dispatched`, () => {
        const kialiState = KIALI_INIT_STATE;
        const config = {
          config: configJson
        }
        const action = {
          type: kialiActions.SET_CONFIG,
          payload: {
            config: configJson
          }
        };
    
        const updatedState = KialiReducer(kialiState, action);
    
        expect(updatedState).toEqual({
         ...kialiState,
         config: config
        });
    }); 
    
    test(`should initialize alerts when ${kialiActions.SET_ALERTS} action is dispatched`, () => {
        const kialiState = KIALI_INIT_STATE;
        const alerts = [
          {message:'[Error Message] Test', severity: 'error'},
          {message:'[Warning Message] Test', severity: 'warning'},
          {message:'[Warning Message Transient] Test', severity: 'warning', display: 'transient'}
        ]
        const action = {
          type: kialiActions.SET_ALERTS,
          payload: alerts
        };
    
        const updatedState = KialiReducer(kialiState, action);
    
        expect(updatedState).toEqual({
         ...kialiState,
         alerts: alerts
        });
      });   
    
      test(`should initialize namespaces when ${kialiActions.SET_NAMESPACES} action is dispatched`, () => {
        const kialiState = KIALI_INIT_STATE;
        const namespaces = [
          {name: 'bookinfo', cluster:'kubernetes'},
          {name: 'travel-agency', cluster:'kubernetes'},
          {name: 'travel-portal', cluster:'kubernetes'},
        ]
        const action = {
          type: kialiActions.SET_NAMESPACES,
          payload: namespaces
        };
    
        const updatedState = KialiReducer(kialiState, action);
    
        expect(updatedState).toEqual({
         ...kialiState,
         namespaces: namespaces
        });
      });  
      
      test(`should initialize activeNamespaces when ${kialiActions.SET_ACTIVE_NAMESPACES} action is dispatched`, () => {
        const kialiState = KIALI_INIT_STATE;    

        const activeNamespaces= [
          {name: 'bookinfo', cluster:'kubernetes'}
        ]

        const action = {
          type: kialiActions.SET_ACTIVE_NAMESPACES,
          payload: activeNamespaces
        };
    
        const updatedState = KialiReducer(kialiState, action);
    
        expect(updatedState).toEqual({
         ...kialiState,
         activeNamespaces: activeNamespaces
        });
      }); 

      test(`should return state when no action is dispatched`, () => {
        const kialiState = KIALI_INIT_STATE;       

        const action = {
          type: 'No action',
          payload: "something"
        };
    
        const updatedState = KialiReducer(kialiState, action);
    
        expect(updatedState).toEqual(kialiState);
      }); 
  });