import Head from "next/head";
import PageNotFoundComponent from "../components/basics/PageNotFound";

export default function PageNotFound() {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <PageNotFoundComponent />
    </>
  );
}
