import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import useDebounce from 'react-use/lib/useDebounce';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Card, CardContent, CardHeader, Chip, CircularProgress, Grid } from '@material-ui/core';
import { AddCircleRounded } from '@material-ui/icons';
import {
  CodeSnippet,
  Link,
  WarningPanel
} from '@backstage/core-components';
import { artifactRouteRef, rootRouteRef } from '../../routes';
import { ArtifactsSearchResults, SearchedArtifact } from '@janus-idp/plugin-apicurio-common';
import { apicurioApiRef } from '../../api';
import { ArtifactTypeIcon } from './ArtifactTypeIcon';
import { ArtifactsToolbar } from './ArtifactsToolbar';
import { FilterFields } from './ArtifactsToolbar';

export const Artifacts = () => {
  const apicurioClient = useApi(apicurioApiRef);
  apicurioClient.setEntity(useEntity().entity)
  const [artifacts, setArtifacts] = useState<ArtifactsSearchResults | null>(null);
  const artifactsLink = useRouteRef(rootRouteRef);
  const artifactDetailLink = useRouteRef(artifactRouteRef);
  const [searchParams, _] = useSearchParams();  
  const [artifactFilterField, setArtifactFilterField] = useState<string>('name');
  const [artifactFilterValue, setArtifactFilterValue] = useState<string>('');
  const [artifactLimit, setArtifactLimit] = useState<number>(10);
  const [artifactPage, setArtifactPage] = useState<number>(0);
  const [artifactSort, setArtifactSort] = useState<string>('asc')
  
  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      FilterFields.forEach(f => {if (searchParams.get(f)){setArtifactFilterField(f); setArtifactFilterValue(searchParams.get(f) || '')}})      
      await fetchArtifacts()          
    }, [],
    { loading: true } 
  )
  React.useEffect(() => {
    FilterFields.forEach(f => {if (searchParams.get(f)){setArtifactFilterField(f); setArtifactFilterValue(searchParams.get(f) || '')}})
    fetchArtifacts() 
  }, [artifactPage, artifactSort]);

  const fetchArtifacts =
    async (value: string = artifactFilterValue, sort: string = artifactSort) => {
      let query: Record<string, any> = {}
      if (value.length > 0) { query[artifactFilterField] = value}
      query['limit'] = artifactLimit;
      query['offset'] = artifactPage * artifactLimit;
      query['order'] = sort
      query['orderby'] = 'name'
      const artifacts = await apicurioClient.searchArtifacts(query);
      setArtifacts(artifacts)          
  }

  const getArtifactTitle = (artifact: SearchedArtifact) => {
    return (
      <>
      <Link to={artifactsLink()+'?group='+artifact.groupId} onClick={() => {setArtifactFilterField('group'); setArtifactFilterValue(artifact.groupId || '')}} style={{color: '#2b9af3', textDecoration: 'none'}}>{artifact.groupId} / </Link>
      <Link to={artifactDetailLink({groupId: artifact.groupId || '', id:artifact.id, version: 'latest'})} style={{color: '#2b9af3', textDecoration: 'none'}}>{artifact.id}</Link>
      </>
    )
  }

  useDebounce(refresh, 10)
  if (error) {
    return (
      <WarningPanel severity="error" title="Could not fetch info from Apicurio.">
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }
  
  return  (
    <Card>
      <CardHeader title={
        <ArtifactsToolbar 
          fieldType={artifactFilterField} fieldValue={artifactFilterValue} limit={artifactLimit} page={artifactPage} total={artifacts!.count || 0} sortAsc={artifactSort === 'asc'}
          onFilterValueChange={(value: string) => {setArtifactFilterValue(value); value === '' && fetchArtifacts('')}}
          onFilterFieldChange={setArtifactFilterField}
          onLimitChange={(limit: number) => {setArtifactLimit(limit); setArtifactPage(0)}} 
          onSortChange={(asc: boolean) => {setArtifactSort(asc? 'asc' : 'desc'); fetchArtifacts(artifactFilterValue, asc? 'asc' : 'desc')}}
          onPageChange={setArtifactPage}
          onClearInput={() => setArtifactFilterValue('')} onRefresh={() => fetchArtifacts()}
        />  
      }/>
      <CardContent>       
        <Grid container spacing={0} style={{marginTop: '20px'}}>    
          {artifacts && artifacts.count > 0 ? (
            artifacts.artifacts.map((artifact, index) => (
              <Grid item key={'artifact_' + index} xs={12}>
                <Card variant="outlined">
                  <CardHeader avatar={<ArtifactTypeIcon type={artifact.type }/>} title={getArtifactTitle(artifact)} titleTypographyProps={{variant: 'h5'}}/> 
                  <CardContent style={{marginLeft: '40px'}}>
                    <Grid container direction='column'>
                      <Grid item>{artifact.description? artifact.description : `An artifact of type ${artifact.type} with no description.`}</Grid>
                      <Grid item>{artifact.labels && artifact.labels.map(l => <Chip label={l} style={{color: '#151515', backgroundColor: '#f0f0f0'}}/>)}</Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ): (
            <Grid item xs={12}>
                <Card variant="outlined">              
                <CardContent>
                  <Grid container direction='column' style={{textAlign: 'center'}}>
                    <Grid item><AddCircleRounded style={{fontSize: '3.375rem', color: '#6a6a73'}}/></Grid>
                    <Grid item style={{fontWeight: 'bold', fontSize: '1.25rem'}}>No artifacts found</Grid>
                    <Grid item style={{color: '#6a6a73'}}>No artifacts match your filter settings. Change your filter or perhaps Upload a new artifact in apicurio related with your entity.</Grid>
                  </Grid>
                </CardContent>
              </Card> 
            </Grid>

          )}             
        </Grid>
      </CardContent> 
    </Card>
    );  
}
