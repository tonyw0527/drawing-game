import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="창의력을 맘껏 뽐낼 수 있는 드로잉 게임입니다."
          />
          {/* <meta property="og:url" content="http://histime.ga" /> */}
          <meta property="og:title" content="Drawing Game" />
          <meta
            property="og:description"
            content="창의력을 맘껏 뽐낼 수 있는 드로잉 게임입니다."
          />
          <meta
            property="og:image"
            // content="https://histime.ga/thumbnail.gif"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
