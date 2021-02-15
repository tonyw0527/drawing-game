import { useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import DarkModeToggleButton from "./DarkModeToggleButton";

const Container = styled.div``;

type HeaderProps = {
  onToggleTheme: () => void;
};

const Header = ({ onToggleTheme }: HeaderProps) => {
  const router = useRouter();

  if (router.pathname !== "/") {
    return <div></div>;
  }

  return (
    <Container>
      <DarkModeToggleButton onToggleTheme={onToggleTheme} />
    </Container>
  );
};

export default Header;
