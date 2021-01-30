import { ReactNode } from "react";
import Header from "./Header";
import styled from "styled-components";

const Container = styled.div`
  width: 100vh;
  height: 100%;
`;

type LayoutProps = {
  children: ReactNode;
  onToggleTheme: () => void;
};

const Layout = ({ children, onToggleTheme }: LayoutProps) => (
  <Container>
    <Header onToggleTheme={onToggleTheme} />
    {children}
  </Container>
);

export default Layout;
