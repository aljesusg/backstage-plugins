export const KIALI_ENDPOINTS = {
    aggregateGraphElements: (namespace: string, aggregate: string, aggregateValue: string) =>
        `api/namespaces/${namespace}/aggregates/${aggregate}/${aggregateValue}/graph`,
    aggregateByServiceGraphElements: (
        namespace: string,
        aggregate: string,
        aggregateValue: string,
        service: string
    ) => `api/namespaces/${namespace}/aggregates/${aggregate}/${aggregateValue}/${service}/graph`,
    aggregateMetrics: (namespace: string, aggregate: string, aggregateValue: string) =>
        `api/namespaces/${namespace}/aggregates/${aggregate}/${aggregateValue}/metrics`,
    authenticate: 'api/authenticate',
    authInfo: 'api/auth/info',
    apps: (namespace: string) => `api/namespaces/${namespace}/apps`,
    app: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}`,
    appGraphElements: (namespace: string, app: string, version?: string) => {
        const baseUrl = `api/namespaces/${namespace}/applications/${app}`;
        const hasVersion = version && version !== 'unknown';
        const versionSuffixed = hasVersion ? `${baseUrl}/versions/${version}` : baseUrl;
        return `${versionSuffixed}/graph`;
    },
    appHealth: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}/health`,
    appMetrics: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}/metrics`,
    appDashboard: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}/dashboard`,
    appSpans: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}/spans`,
    canaryUpgradeStatus: () => 'api/mesh/canaries/status',
    clusters: 'api/clusters',
    crippledFeatures: 'api/crippled',
    serviceSpans: (namespace: string, service: string) => `api/namespaces/${namespace}/services/${service}/spans`,
    workloadSpans: (namespace: string, workload: string) => `api/namespaces/${namespace}/workloads/${workload}/spans`,
    customDashboard: (namespace: string, template: string) =>
        `api/namespaces/${namespace}/customdashboard/${template}`,
    grafana: 'api/grafana',
    istioConfig: (namespace: string) => `api/namespaces/${namespace}/istio`,
    allIstioConfigs: () => `api/istio/config`,
    istioConfigCreate: (namespace: string, objectType: string) => `api/namespaces/${namespace}/istio/${objectType}`,
    istioConfigDetail: (namespace: string, objectType: string, object: string) =>
        `api/namespaces/${namespace}/istio/${objectType}/${object}`,
    istioPermissions: 'api/istio/permissions',
    jaeger: 'api/jaeger',
    appTraces: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}/traces`,
    serviceTraces: (namespace: string, svc: string) => `api/namespaces/${namespace}/services/${svc}/traces`,
    workloadTraces: (namespace: string, wkd: string) => `api/namespaces/${namespace}/workloads/${wkd}/traces`,
    jaegerErrorTraces: (namespace: string, app: string) => `api/namespaces/${namespace}/apps/${app}/errortraces`,
    jaegerTrace: (idTrace: string) => `api/traces/${idTrace}`,
    logout: 'api/logout',
    metricsStats: 'api/stats/metrics',
    namespaces: 'api/namespaces',
    namespace: (namespace: string) => `api/namespaces/${namespace}`,
    namespacesGraphElements: `api/namespaces/graph`,
    namespaceHealth: (namespace: string) => `api/namespaces/${namespace}/health`,
    namespaceMetrics: (namespace: string) => `api/namespaces/${namespace}/metrics`,
    namespaceTls: (namespace: string) => `api/namespaces/${namespace}/tls`,
    namespaceValidations: (namespace: string) => `api/namespaces/${namespace}/validations`,
    configValidations: () => `api/istio/validations`,
    meshTls: () => 'api/mesh/tls',
    outboundTrafficPolicyMode: () => 'api/mesh/outbound_traffic_policy/mode',
    istioStatus: () => 'api/istio/status',
    istioCertsInfo: () => 'api/istio/certs',
    istiodResourceThresholds: () => 'api/mesh/resources/thresholds',
    pod: (namespace: string, pod: string) => `api/namespaces/${namespace}/pods/${pod}`,
    podLogs: (namespace: string, pod: string) => `api/namespaces/${namespace}/pods/${pod}/logs`,
    podEnvoyProxy: (namespace: string, pod: string) => `api/namespaces/${namespace}/pods/${pod}/config_dump`,
    podEnvoyProxyLogging: (namespace: string, pod: string) => `api/namespaces/${namespace}/pods/${pod}/logging`,
    podEnvoyProxyResourceEntries: (namespace: string, pod: string, resource: string) =>
        `api/namespaces/${namespace}/pods/${pod}/config_dump/${resource}`,
    serverConfig: `api/config`,
    services: (namespace: string) => `api/namespaces/${namespace}/services`,
    service: (namespace: string, service: string) => `api/namespaces/${namespace}/services/${service}`,
    serviceGraphElements: (namespace: string, service: string) =>
        `api/namespaces/${namespace}/services/${service}/graph`,
    serviceHealth: (namespace: string, service: string) => `api/namespaces/${namespace}/services/${service}/health`,
    serviceMetrics: (namespace: string, service: string) => `api/namespaces/${namespace}/services/${service}/metrics`,
    serviceDashboard: (namespace: string, service: string) =>
        `api/namespaces/${namespace}/services/${service}/dashboard`,
    status: 'api/status',
    workloads: (namespace: string) => `api/namespaces/${namespace}/workloads`,
    workload: (namespace: string, workload: string) => `api/namespaces/${namespace}/workloads/${workload}`,
    workloadGraphElements: (namespace: string, workload: string) =>
        `api/namespaces/${namespace}/workloads/${workload}/graph`,
    workloadHealth: (namespace: string, workload: string) =>
        `api/namespaces/${namespace}/workloads/${workload}/health`,
    workloadMetrics: (namespace: string, workload: string) =>
        `api/namespaces/${namespace}/workloads/${workload}/metrics`,
    workloadDashboard: (namespace: string, workload: string) =>
        `api/namespaces/${namespace}/workloads/${workload}/dashboard`      
}