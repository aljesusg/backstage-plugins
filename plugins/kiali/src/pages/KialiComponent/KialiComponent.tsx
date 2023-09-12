import React from 'react';
import {
  CardTab,
  Content,
  Page,
  TabbedCard,
} from '@backstage/core-components';
import { Overview } from '../Overview';
import { KialiHeader } from './Header';
import { KialiStateProvider} from "../../context";
import { KialiNoPath } from '../NoPath';

const noPath = 'noPath';
const getPathPage = () => {
  const pathname = window.location.pathname.split('/').pop();
  return pathname && pathname === 'kiali' ? 'overview' : pathname? pathname : noPath;
};

export const KialiComponent = () => {
  const [kialiTab, setKialiTab] = React.useState<string>(getPathPage());
  return (
    <Page themeId="tool">
      <Content>
        <KialiStateProvider>   
        {kialiTab === noPath? (<KialiNoPath/>) : (       
          <>
            <KialiHeader />  
            <TabbedCard
                value={kialiTab}
                onChange={(_, v) => setKialiTab(v as string)}
              >
                {/* 
                  // @ts-ignore */}
                <CardTab value="overview" label="Overview">
                  <Overview/>
                </CardTab>
            </TabbedCard>
          </>
         )}
        </KialiStateProvider>
      </Content>
    </Page>
  );
};
