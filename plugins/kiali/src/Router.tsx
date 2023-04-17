import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { Button } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Route, Routes } from 'react-router-dom';
import { ExampleComponent } from './components/ExampleComponent'


export const KUBERNETES_ANNOTATION = 'backstage.io/kubernetes-id';
const KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION =
  'backstage.io/kubernetes-label-selector';

export const isKubernetesAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[KUBERNETES_ANNOTATION]) ||
  Boolean(
    entity.metadata.annotations?.[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION],
  );



  export const Router = (props: { refreshIntervalMs?: number }) => {
    const { entity } = useEntity();
    const kubernetesAnnotationValue =
      entity.metadata.annotations?.[KUBERNETES_ANNOTATION];
  
    const kubernetesLabelSelectorQueryAnnotationValue =
      entity.metadata.annotations?.[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION];
  
    if (
      kubernetesAnnotationValue ||
      kubernetesLabelSelectorQueryAnnotationValue
    ) {
      return (
        <Routes>
          <Route
            path="/"
            element={
              <ExampleComponent
                entity={entity}
                refreshIntervalMs={props.refreshIntervalMs}
              />
            }
          />
        </Routes>
      );
    }
  
    return (
      <>
        <h1>
          Missing label or use a label selector query, which takes precedence over the previous
          annotation.
        </h1>
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs/features/kubernetes/configuration#surfacing-your-kubernetes-components-as-part-of-an-entity"
        >
          Read Kubernetes Plugin Docs
        </Button>
      </>
    );
  };  