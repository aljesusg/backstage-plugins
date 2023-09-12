export type KialiDetails = {
    url: string;
    strategy: string;
    skipTLSVerify?: boolean;
    serviceAccountToken?: string;
    caData?: string;
    caFile?: string;
    sessionTime?: number;
  };