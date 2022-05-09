import Head from 'next/head'
import {NextUIProvider} from '@nextui-org/react';
import { GiverProvider } from "../context/giver";
import { HeirProvider } from '../context/heir';
import { WillProvider } from "../context/will";
import { WillsProvider } from "../context/wills";

export default function MainLayout ({ children }) {
  return (
    <NextUIProvider>
      <GiverProvider>
        <HeirProvider>
          <WillsProvider>
            <WillProvider>
              <Head>
                <meta name="description" content="Find peace of mind. Pass on your cryptos!" />
              </Head>
              <div className="container">
                <main className="mainWrapper">{ children }</main>
              </div>
            </WillProvider>
          </WillsProvider>
        </HeirProvider>
      </GiverProvider>
    </NextUIProvider>
  );
}
