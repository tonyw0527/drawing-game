import { ReactNode } from "react";
import Header from "./Header";
import Copyright from "./Copyright";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
`;

type LayoutProps = {
  children: ReactNode;
  onToggleTheme: () => void;
};

const Layout = ({ children, onToggleTheme }: LayoutProps) => (
  <Container>
    <Header onToggleTheme={onToggleTheme} />
    {children}
    <Copyright />
  </Container>
);

export default Layout;
