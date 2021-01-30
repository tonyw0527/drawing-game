import Head from "next/head";
import HomeComponent from "../components/home/Home";
import styled from "styled-components";

const Container = styled.div`
  width: 200px;
  height: 200px;
`;

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Drawing Game Home</title>
      </Head>

      <HomeComponent />
    </Container>
  );
}
