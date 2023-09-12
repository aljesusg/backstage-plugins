import { kialiActions } from "./actions";
import { kiali_state_type } from "./types";

export const KialiReducer = (state: kiali_state_type, action: {type: string, payload: any}): kiali_state_type => {
    switch (action.type) {
      case kialiActions.SET_INFO:
        return {
          ...state,
          info: action.payload
        };
      case kialiActions.SET_CONFIG:
        return {
          ...state,
          config: action.payload
        };
      case kialiActions.SET_ALERTS:
        return {
            ...state,
            alerts: [...action.payload]
        };
      case kialiActions.SET_NAMESPACES:
        return {
          ...state,
          namespaces: action.payload
        };
      case kialiActions.SET_ACTIVE_NAMESPACES:
        return {
          ...state,
          activeNamespaces: action.payload
        }      
      default:
        return state;
    }
};