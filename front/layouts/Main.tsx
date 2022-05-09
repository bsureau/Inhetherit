import Head from 'next/head'
import {NextUIProvider} from '@nextui-org/react';
import { GiverProvider } from "../context/giver";
import { WillProvider } from "../context/will";

export default function MainLayout ({ children }) {
  return (
    <NextUIProvider>
      <GiverProvider>
        <WillProvider>
          <Head>
            <meta name="description" content="Find peace of mind. Pass on your cryptos!" />
          </Head>
          <div className="container">
            <main className="mainWrapper">{ children }</main>
          </div>
        </WillProvider>
      </GiverProvider>
    </NextUIProvider>
  );
}
