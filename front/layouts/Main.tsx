import Head from 'next/head'
import {NextUIProvider} from '@nextui-org/react';
import { UserProvider } from "../context/user";
import { WillProvider } from "../context/will";

export default function MainLayout ({ children }) {
  return (
    <NextUIProvider>
      <UserProvider>
        <WillProvider>
          <Head>
            <meta name="description" content="Find peace of mind. Pass on your cryptos!" />
          </Head>
          <div className="container">
            <main className="mainWrapper">{ children }</main>
          </div>
        </WillProvider>
      </UserProvider>
    </NextUIProvider>
  );
}