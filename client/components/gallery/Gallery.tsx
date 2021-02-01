import React, { useState, useEffect, useRef } from "react";
import { canvasImgSetting } from "../../utils/utils";
import { useRouter } from "next/router";
import { useStore } from "../../stores/StoreProvider";
import { ko_pack } from "../../utils/localization/lang_packs";
import io from "socket.io-client";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100%;

  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const TitleBox = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const TitleStrong = styled.strong`
  font-size: 1.3rem;
`;
const TitleSpan = styled.span`
  font-size: 1.1rem;
`;

const GalleryListBox = styled.span`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const CanvasBox = styled.div`
  margin: 0.5rem;
  text-align: center;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.25); ;
`;
const Canvas = styled.canvas`
  border-radius: 1rem;
`;
const CanvasDesc = styled.div`
  display: flex;
  justify-content: center;
`;
const DescH3 = styled.h3`
  margin-top: 0.45rem;
  margin-right: 0.7px;
  font-size: 1.1rem;
`;

const DescBtn = styled.button`
  display: flex;
  flex-direction: column;
  width: 40px;
  border: none;
  background-color: transparent;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;

  &:disabled {
    display: none;
  }
`;
const DescIcon = styled.i`
  width: 100%;
  height: 40%;
  margin-bottom: 0.2rem;
  color: transparent;
  background-image: url("./icons/likes_icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;
const DescSpan = styled.span`
  width: 100%;
  font-size: 0.8rem;
  text-align: center;
`;
const DeleteBtn = styled(DescBtn)`
  border: none;
  background-color: transparent;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  color: red;
`;

const LoadingBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const { GALLERY_TITLE_INFO, GALLERY_LOADING_INFO } = ko_pack;

const Gallery = (props) => {
  const router = useRouter();
  const { userStore } = useStore();
  const { nickname, invicode, isAuth } = userStore;
  const nickName = nickname;
  const code = invicode;

  const [Data, setData] = useState([]);
  const [IsAdmin, setIsAdmin] = useState(false);

  const socketRef = useRef<any>();

  useEffect(() => {
    const socket =
      process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? io("/")
        : io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("socket connected - ", socket.id);
    });

    socket.emit("gallery-login", { nickName, code });

    socket.on("gallery-login", (isAdmin) => {
      console.log("gallery logged in");
      setIsAdmin(isAdmin);
    });

    socket.emit("db-read");

    socket.on("db-read", (data) => {
      setData(data);
      console.log(data);
    });

    socket.on("db-update", (flag) => {
      console.log(flag);
      console.log("hi");
      if (flag) {
        socket.emit("db-read");
      }
    });

    socket.on("db-delete", (flag) => {
      if (flag) {
        socket.emit("db-read");
      }
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, []);

  const renderDrawings = () => {
    if (Data.length === 0) {
      return (
        <LoadingBox>
          <h1>{GALLERY_LOADING_INFO}</h1>
        </LoadingBox>
      );
    }
    const list = Data.map((item, index) => {
      const canvas = (
        <CanvasBox key={index}>
          <Canvas id={item.title} width="350" height="350">
            {item.title}
          </Canvas>
          <CanvasDesc>
            <DescH3>{item.title}</DescH3>
            <DescBtn
              className="likes-btn"
              id={item._id}
              type="button"
              onClick={(e) => {
                socketRef.current.emit("db-update", {
                  id: e.currentTarget.id,
                  name: nickName,
                });
              }}
            >
              <DescIcon className="likes-btn-icon">likes</DescIcon>
              <DescSpan>{item.likes.length}</DescSpan>
            </DescBtn>
          </CanvasDesc>
          <DeleteBtn
            className="delete-btn"
            id={item._id}
            disabled={!IsAdmin}
            type="button"
            onClick={(e) => {
              const flag = prompt("정말 삭제하시겠습니까? y/n");
              if (flag === "y") {
                socketRef.current.emit("db-delete", e.currentTarget.id);
              }
            }}
          >
            Delete
          </DeleteBtn>
        </CanvasBox>
      );

      setTimeout(() => {
        const canvasRef = document.getElementById(`${item.title}`);
        canvasImgSetting(canvasRef, item.content);
      }, 1);

      return canvas;
    });

    return list;
  };

  if (!isAuth) {
    router.push("/");
  }

  return (
    <Container>
      <TitleBox>
        <TitleSpan>
          <TitleStrong>{nickName}</TitleStrong> {GALLERY_TITLE_INFO}
        </TitleSpan>
      </TitleBox>
      <GalleryListBox>{renderDrawings()}</GalleryListBox>
    </Container>
  );
};

export default Gallery;
