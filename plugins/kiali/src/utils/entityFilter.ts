import { Entity } from '@backstage/catalog-model';

import {
  KIALI_ANNOTATION,
  KIALI_LABEL_SELECTOR_QUERY_ANNOTATION,
  KIALI_NAMESPACE,
} from '../components/Router';
import { Namespace } from '../types/Namespace';

const filterById = (ns: Namespace[], value: string): Namespace[] => {
  const values = value.split(',');
  return ns.filter(
    n => n.labels && values.includes(n.labels[KIALI_ANNOTATION]),
  );
};

const filterBySelector = (ns: Namespace[], value: string): Namespace[] => {
  const values = value.split(',');
  return ns.filter(
    n =>
      values.filter(v => {
        const [key, valueLabel] = v.split('=');
        return n.labels && n.labels[key] === valueLabel;
      }).length > 0,
  );
};

const filterByNs = (ns: Namespace[], value: string): Namespace[] => {
  const values = value.split(',');
  return ns.filter(n => values.includes(n.name));
};

export const filterNsByAnnotation = (
  ns: Namespace[],
  entity: Entity | undefined,
): Namespace[] => {
  if (!entity) {
    return ns;
  }
  const annotations = entity?.metadata?.annotations || undefined;
  if (!annotations) {
    return [];
  }

  let nsFilter = ns;
  nsFilter = annotations[KIALI_ANNOTATION]
    ? filterById(nsFilter, decodeURIComponent(annotations[KIALI_ANNOTATION]))
    : nsFilter;
  nsFilter = annotations[KIALI_LABEL_SELECTOR_QUERY_ANNOTATION]
    ? filterBySelector(
        nsFilter,
        decodeURIComponent(annotations[KIALI_LABEL_SELECTOR_QUERY_ANNOTATION]),
      )
    : nsFilter;
  nsFilter = annotations[KIALI_NAMESPACE]
    ? filterByNs(nsFilter, decodeURIComponent(annotations[KIALI_NAMESPACE]))
    : nsFilter;
  return nsFilter;
};

export const exportedForTesting = {
  filterById,
  filterBySelector,
  filterByNs,
};
