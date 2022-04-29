import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';


// This default export is required in a new `pages/_app.js` file.
export default function Inhetherit({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}
