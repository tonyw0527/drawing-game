import { useState } from "react";
import styled from "styled-components";

type OverlayProps = {
  visible: boolean;
};
const Overlay = styled.div<OverlayProps>`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;
type WrapperProps = {
  visible: boolean;
};
const Wrapper = styled.div<WrapperProps>`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  position: relative;
  width: 20rem;
  max-width: 20rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  color: black;
`;
const Header = styled.header`
  position: relative;
  width: 100%;
  padding: 1rem;
`;
const H1 = styled.h1`
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
`;
const TopButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 0;
  background: none;
  border: 0;

  &: hover {
    cursor: pointer;
  }
`;
const Main = styled.main`
  margin-bottom: 1rem;
`;
const Span = styled.span``;
const Footer = styled.footer``;
const BottomButton = styled.button`
  padding: 0.3rem;
  border: 0;
  background: gray;
  color: white;

  &: hover {
    cursor: pointer;
  }
`;

type PopupProps = {
  visible: boolean;
  title: string;
  msg: string;
  close: string;
  onClose: () => void;
};

function Popup({ visible, title, msg, close, onClose }: PopupProps) {
  return (
    <>
      <Overlay visible={visible} />
      <Wrapper visible={visible} tabIndex={-1} onClick={onClose}>
        <Section tabIndex={0}>
          <Header>
            <H1>{title}</H1>
            <TopButton onClick={onClose}>X</TopButton>
          </Header>
          <Main>
            <Span>{msg}</Span>
          </Main>
          <Footer>
            <BottomButton onClick={onClose}>{close}</BottomButton>
          </Footer>
        </Section>
      </Wrapper>
    </>
  );
}

export default Popup;
