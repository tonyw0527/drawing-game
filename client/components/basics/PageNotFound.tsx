import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 87vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ImgWrapper = styled.div``;
const H1 = styled.h1`
  text-align: center;
`;
const H2 = styled.h2`
  margin-top: 2rem;
  text-align: center;
  font-size: 4rem;
`;
const P = styled.p`
  text-align: center;
  font-size: 1rem;
`;
const ButtonsWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;
const Button = styled.button`
  width: 10rem;
  margin: 1rem 0.5rem 0 0.5rem;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.color.text};
  border-radius: 0.5rem;
  background: none;
  color: ${({ theme }) => theme.color.text};
  text-align: center;
  font-size: 1rem;

  &: hover {
    cursor: pointer;
  }
`;

function PageNotFound() {
  const router = useRouter();
  return (
    <Container>
      <Image src="/404.svg" alt="Page Not Found" width={200} height={200} />
      <H2>404</H2>
      {/* <H1>Page Not Found</H1> */}
      <H1>페이지를 찾을 수 없습니다.</H1>
      <P>페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.</P>
      <ButtonsWrapper>
        <Button
          type="button"
          onClick={() => {
            router.push("/");
          }}
        >
          홈으로
        </Button>
        <Button
          type="button"
          onClick={() => {
            router.back();
          }}
        >
          이전페이지로
        </Button>
      </ButtonsWrapper>
    </Container>
  );
}

export default PageNotFound;
