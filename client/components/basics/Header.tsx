import styled from "styled-components";
import Link from "next/link";
import DarkModeToggleButton from "./DarkModeToggleButton";

const Container = styled.div`
  display: flex;
  justify-content: start;
  padding: 0.5rem 1.1rem 0.8rem;
  width: 100%;
`;

const A = styled.a`
  margin-right: 1rem;
  font-size: 1.3rem;
  margin-top: 0.3rem;

  &: hover {
    cursor: pointer;
  }
`;

type HeaderProps = {
  onToggleTheme: () => void;
};

const Header = ({ onToggleTheme }: HeaderProps) => (
  <Container>
    <DarkModeToggleButton onToggleTheme={onToggleTheme} />
    <Link href="/">
      <A>Home</A>
    </Link>
    <Link href="/painter">
      <A>Game</A>
    </Link>
    <Link href="/gallery">
      <A>Gallery</A>
    </Link>
  </Container>
);

export default Header;
