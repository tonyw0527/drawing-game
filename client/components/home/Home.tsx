import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { ko_pack } from "../../utils/localization/lang_packs";
import { useStore } from "../../stores/StoreProvider";
import { observer } from "mobx-react";
import Popup from "../basics/Popup";
import Link from "next/link";
import Copyright from "../basics/Copyright";
import styled from "styled-components";

const { HOME_TITLE_H1, HOME_TITLE_H2, HOME_NICKNAME_INFO } = ko_pack;

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: white;

  background: ${({ theme }) => {
    return theme.mode === "light"
      ? "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
      : "linear-gradient(-45deg, #006a4e, #36454f, #08457e, #002e63)";
  }};
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Wrapper = styled.div`
  width: 300px;
  height: 300px;

  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const H1 = styled.h1`
  margin: 0;
  margin-top: 2rem;
  text-align: center;
`;

const Span = styled.span`
  width: 100%;
  display: block;
  margin-bottom: 1rem;

  text-align: center;
  font-size: 1rem;
`;
const Form = styled.form`
  width: 100%;
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;
const Input = styled.input`
  display: block;
  margin-bottom: 0.6rem;
  padding: 5px 8px;
  border: 0;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.25);
  background: none;
  color: white;

  &: focus {
    outline: 0;
  }

  &:: placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;
const Button = styled.button`
  display: block;
  margin-top: 0.5rem;
  padding: 5px 8px;
  border-radius: 5px;
  border: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.5);
  color: white;

  &: disabled {
    background: rgba(255, 255, 255, 0.25);
  }
`;
const StateBox = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  margin-top: 5rem;
  padding: 0 4rem;
`;

const A = styled.a`
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid white;
  border-radius: 1rem;
  text-align: center;

  &: hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.5);
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0rem;
`;

const Home = observer(() => {
  const router = useRouter();
  const { userStore } = useStore();
  const { isAuth } = userStore;

  const [NickName, setNickName] = useState<string>("");
  const [Code, setCode] = useState<string>("");
  const [isPopUp, setIsPopUp] = useState<boolean>(false);

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

  const onClose = () => {
    setIsPopUp(false);
  };

  return (
    <Container>
      <Popup
        visible={isPopUp}
        title={"인증 오류"}
        msg={"초대코드를 다시 입력해주세요."}
        close={"확인"}
        onClose={onClose}
      />
      <Wrapper>
        <div>
          <H1>{HOME_TITLE_H1}</H1>
        </div>
        <StateBox ref={stateBoxRef}>
          <Span>
            {userStore.nickname}
            {"님 "}
            {"환영합니다 :D"}
          </Span>

          <Link href="/painter">
            <A>게임 참가하기</A>
          </Link>

          <Link href="/gallery">
            <A>갤러리 구경하기</A>
          </Link>
        </StateBox>
        <Form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();

            userStore.setNickname(NickName);
            userStore.setInvicode(Code);
            userStore.requestAuth().then((res) => {
              if (res) {
                console.log("인증 완료");
                setIsPopUp(false);
              } else {
                console.log("초대코드 틀림");
                setIsPopUp(true);
              }
            });
            console.log("try socket connecting");

            // userStore.connectSocket();
            // router.push("/painter");
          }}
        >
          <Span>{HOME_NICKNAME_INFO}</Span>
          <Input
            ref={nameInputRef}
            type="text"
            maxLength={12}
            placeholder="Nickname"
            value={NickName}
            onChange={(e) => {
              setNickName(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="Invitation code"
            value={Code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <Button disabled={!Code || !NickName} type="submit">
            로그인
          </Button>
        </Form>
      </Wrapper>
      <Footer>
        <Copyright />
      </Footer>
    </Container>
  );
});

export default Home;
