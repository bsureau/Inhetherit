import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../store'

// This default export is required in a new `pages/_app.js` file.
export default function Inhetherit({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </NextUIProvider>
  );
}
