import { Entity } from '@backstage/catalog-model';
import { Namespace } from '@janus-idp/plugin-kiali-common';
import { KUBERNETES_ANNOTATION } from '../Router';

export const filterNs = (ns: Namespace[], ent: Entity): Namespace[] => {
    if (ent.metadata.annotations && ent.metadata.annotations[KUBERNETES_ANNOTATION]) {
        const value = ent.metadata.annotations[KUBERNETES_ANNOTATION]
        return ns.filter(n => n.labels && n.labels[KUBERNETES_ANNOTATION] == value)
    }
    return ns
}