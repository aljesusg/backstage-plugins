import React from 'react';
import { AlertKialiMessage, KialiContext } from "../../../context";
import { ContentHeader, Select } from '@backstage/core-components';

import { Chip, Drawer, IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import StorageRounded from '@material-ui/icons/StorageRounded';

import { Namespace } from '@janus-idp/backstage-plugin-kiali-common';

import { homeCluster } from '../../../config';
import { StatusContent } from './StatusContent';
import { Alert } from '@material-ui/lab';

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      justifyContent: 'space-between',
      padding: theme.spacing(2.5),
    },
  }),
);

export const KialiHeader = () => {
  const { activeNamespaces, alerts, config, info, namespaces, setActiveNamespaces, removeAlert } = React.useContext(KialiContext); 
  const [isOpen, toggleDrawer] = React.useState<boolean>(false);
  const classes = useDrawerStyles();
  return (
    <>
      <ContentHeader title={'kiali'}>
        {config.username && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ margin: '10px' }}>
              <b>User : </b>
              {config.username}
            </span>
          </div>
        )}
        {homeCluster && (
          <Tooltip
            title={<div>Kiali home cluster: {homeCluster?.name}</div>}
          >
            <Chip icon={<StorageRounded />} label={homeCluster?.name} />
          </Tooltip>
        )}
        <Tooltip title="Show Kiali information">
          <IconButton
            aria-label="info"
            onClick={() => toggleDrawer(true)}
            style={{ marginTop: '-10px' }}
          >
            <Info />
          </IconButton>
        </Tooltip>
        <Drawer
          classes={{
            paper: classes.paper,
          }}
          variant="persistent"
          anchor="right"
          open={isOpen}
          onClose={() => toggleDrawer(false)}
        >
          <StatusContent
            toggleDrawer={toggleDrawer}
            kialiStatus={info}
          />
        </Drawer>
      </ContentHeader>
      <Select
        label="Namespaces Selected"
        placeholder="Select namespaces"
        items={namespaces.map((ns: Namespace) => ({ label: ns.name, value: ns.name }))}
        selected={activeNamespaces.map((ns: Namespace) => ns.name)}
        multiple
        onChange={value => setActiveNamespaces(value as string[])}
      />
      {alerts.length > 0 &&       
        alerts.map((al: AlertKialiMessage) => <Alert severity={al.severity} onClose={() => removeAlert(al.id)}>{al.message}</Alert>)
      }
    </>
  );
};
