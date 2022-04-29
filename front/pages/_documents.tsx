import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@nextui-org/react';

class Inhetherit extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: <>{initialProps.styles}</>
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Find peace of mind. Pass on your cryptos!" />
          <link rel="icon" href="/favicon.ico" />
          {CssBaseline.flush()}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Inhetherit;
