import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import useDebounce from 'react-use/lib/useDebounce';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Grid } from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import {  CircularProgress, Breadcrumbs, Typography } from '@material-ui/core';
import {
  CodeSnippet,
  Link,
  WarningPanel
} from '@backstage/core-components';
import { ApiError, ArtifactDetail } from '@janus-idp/plugin-apicurio-common';
import { apicurioApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { OverviewArtifact } from './OverviewArtifact';
import { ContentArtifact } from './ContentArtifact';
import { ArtifactHeader } from './ArtifactHeader';

export const ArtifactDetailComponent = () => {
  const { groupId, id, version } = useParams();
  const artifactsLink = useRouteRef(rootRouteRef);
  const apicurioClient = useApi(apicurioApiRef);
  const [artifact, setArtifact] = useState<ArtifactDetail>(new ArtifactDetail());
  const [error, setError] = useState<ApiError|null>(null);
  const [{ loading }, refresh] = useAsyncFn(
    async () => {
      const artifact = await apicurioClient.getArtifact(groupId!, id!, version);
      if ('artifact' in artifact) {        
        setArtifact(artifact)   
      } else {
        if (artifact.length > 1) {
          const errorMessage = artifact.map(e => `[${e.error_code}] ${e.detail}`).join('\n')     
          setError({causes: null, error_code: 0, name: `Could not fetch artifact ${groupId}/${id}.`, detail: errorMessage, message: ''})
        } else {           
          setError(artifact[0] as ApiError)
        }
      }
    }, [version],
    { loading: true }, 
  )
  useDebounce(refresh, 10)
  
  if (error) {
    return (
      <>
        <WarningPanel severity="error" title={error.name}>
          <CodeSnippet language="text" text={error.detail} />
        </WarningPanel>
        Return to <Link to={artifactsLink()}><>Artifacts</></Link>
      </>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }
  return  (
    <Grid container spacing={0}>
      {artifact.artifact? (
        <>
          <Grid item xs={12}>
            <Breadcrumbs color="primaryText">
              <Link to={artifactsLink()}><>Artifacts</></Link>
              <Link to={artifactsLink()+'?group='+groupId}>{groupId}</Link>
              <Typography>{id}</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} style={{marginTop: '30px'}}>
            {/* @ts-ignore*/}
            <TabbedCard title={<ArtifactHeader versions={artifact.versions}/>} deepLink={{ title: 'Go to apicurio', link: artifact?.link }}>
              <CardTab label="Overview">
                <OverviewArtifact meta={artifact.artifact} rules={artifact.rules}/>
              </CardTab>
              <CardTab label="Content">
                <ContentArtifact artifactContent={artifact.artifactContent} artifactType={artifact.artifact!.type}/>
              </CardTab>
            </TabbedCard>
          </Grid>
        </>
      ): (
        <Grid item xs={12}>Error</Grid>
      )}      
    </Grid>
  );  
}
