import Head from "next/head";
import HomeComponent from "../components/home/Home";

export default function Home() {
  return (
    <>
      <Head>
        <title>Grinda Home</title>
      </Head>

      <HomeComponent />
    </>
  );
}
