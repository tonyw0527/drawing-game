import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { ko_pack } from "../../utils/localization/lang_packs";
import { useStore } from "../../stores/StoreProvider";
import { observer } from "mobx-react";
import styled from "styled-components";

const { HOME_TITLE_H1, HOME_TITLE_H2, HOME_NICKNAME_INFO } = ko_pack;

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const H1 = styled.h1`
  text-align: center;
`;
const H2 = styled.h2`
  text-align: center;
`;
const Span = styled.span`
  display: block;
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
`;
const Form = styled.form`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Input = styled.input`
  display: block;
`;
const Button = styled.button`
  display: block;
`;
const StateBox = styled.div`
  display: none;
`;

const Home = observer(() => {
  const router = useRouter();
  const { userStore } = useStore();
  const { isAuth } = userStore;

  const [NickName, setNickName] = useState("");
  const [Code, setCode] = useState("");

  const nameInputRef = useRef<HTMLInputElement>();
  const formRef = useRef<HTMLFormElement>();
  const stateBoxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (isAuth) {
      formRef.current.style.display = "none";
      stateBoxRef.current.style.display = "flex";
    } else {
      formRef.current.style.display = "flex";
      stateBoxRef.current.style.display = "none";
    }
  }, [isAuth]);

  return (
    <Container>
      <div>
        <H1>{HOME_TITLE_H1}</H1>
        <StateBox ref={stateBoxRef}>
          <Span>
            {userStore.nickname}
            {"님"}
          </Span>
        </StateBox>
        <H2>{HOME_TITLE_H2}</H2>
      </div>
      <Form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();

          userStore.setNickname(NickName);
          userStore.setInvicode(Code);
          userStore.requestAuth();

          console.log("try socket connecting");

          // userStore.connectSocket();
          // router.push("/painter");
        }}
      >
        <Span>{HOME_NICKNAME_INFO}</Span>
        <Input
          ref={nameInputRef}
          type="text"
          maxLength={9}
          placeholder="Nickname"
          value={NickName}
          onChange={(e) => {
            setNickName(e.target.value);
          }}
        />
        <Input
          type="text"
          maxLength={9}
          placeholder="Invitation code"
          value={Code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <Button disabled={!Code || !NickName} type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
});

export default Home;
