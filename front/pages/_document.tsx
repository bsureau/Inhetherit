import Document, { Html, Head, Main, NextScript } from 'next/document'
import { CssBaseline } from '@nextui-org/react';

class InhetheritDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: <>{initialProps.styles}</>
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico"/>
          {CssBaseline.flush()}
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export default InhetheritDocument;