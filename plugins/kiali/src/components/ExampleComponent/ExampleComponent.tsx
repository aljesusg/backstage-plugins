import React from 'react';
import { Grid } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';


type ExampleComponentProps = {
  entity: Entity;
  refreshIntervalMs?: number;
}

export const ExampleComponent = (props: ExampleComponentProps) => {
  return (
    <Page themeId="tool">
      <Header title="Welcome to kiali!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Plugin title">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">        
          <Grid item>
            <ExampleFetchComponent entity={props.entity} refreshIntervalMs={props.refreshIntervalMs}/>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
}
