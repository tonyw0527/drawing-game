import { StoreProvider } from "../stores/StoreProvider";
import { useDarkMode } from "../hooks/useDarkMode";
import { lightTheme, darkTheme } from "../styles/theme";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/global-styles";
import Layout from "../components/basics/Layout";
import { AppProps } from "next/app";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  const [theme, toggleTheme, componentMounted] = useDarkMode();

  if (!componentMounted) {
    return <div></div>;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Drawing Game</title>
      </Head>
      <StoreProvider {...pageProps}>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyle />
          <Layout onToggleTheme={toggleTheme}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </StoreProvider>
    </>
  );
}

export default App;
