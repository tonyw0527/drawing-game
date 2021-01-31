import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  margin-top: 3px;
  width: 350px;
  height: 200px;
  border-radius: 10px;
  padding: 2px;
`;

const UsersBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border: none;

  font-size: 0.5rem;
  color: rgba(0, 0, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.06);
  cursor: pointer;

  background-image: url("./icons/users_icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.5;
  color: transparent;
`;

const UsersListBox = styled.div`
  position: absolute;
  display: none;
  z-index: 1;
  width: 60px;
  height: 80px;
  top: 30%;
  right: 30%;
  background-color: rgba(255, 255, 255, 0.7);
  overflow-x: hidden;
  border: 1px solid black;
  border-radius: 10px;
  color: black;
`;

const UsersListUl = styled.ul`
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const UsersListLi = styled.li`
  border-bottom: 1px solid black;
`;

const ChatLogBox = styled.div`
  width: 100%;
  height: 85%;
  padding: 5px 5px;

  overflow-x: hidden;
  background-color: white;

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

interface ChaptLogProps {
  fontSize: string;
  testAlign: string;
}

const ChaptLog = styled.span<ChaptLogProps>`
  display: block;
  font-size: ${(props) => props.fontSize};
  text-align: ${(props) => props.testAlign};
  color: ${(props) => props.color};
`;

const ChatTypingBox = styled.div`
  position: absolute;
  bottom: 2px;
  width: 100%;
`;

const ChatTypingBoxInput = styled.input`
  width: 69%;
  margin-right: 0.5%;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid black;
`;

const ChatTypingBoxBtn = styled.button`
  width: 29%;
  padding: 5px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: yellow;
`;

const Chat = ({ MyName }) => {
  const socketRef = useRef<any>();
  const msgInputRef = useRef<HTMLInputElement>();
  const chatRef = useRef<HTMLDivElement>();
  const userListRef = useRef<HTMLDivElement>();
  const userListButtonRef = useRef<HTMLButtonElement>();

  const [Message, setMessage] = useState("");
  const [Chat, setChat] = useState([]);
  const [UserList, setUserList] = useState([]);

  const renderChat = () => {
    return Chat.map((item, index) => {
      if (item.name === MyName) {
        return (
          <ChaptLog
            color="orange"
            testAlign="right"
            fontSize="1rem"
            key={index}
          >
            {item.msg}
          </ChaptLog>
        );
      } else if (item.name === "info-bingo") {
        return (
          <ChaptLog
            color="rgb(51, 255, 0)"
            testAlign="center"
            fontSize="1rem"
            key={index}
          >
            {item.msg}
          </ChaptLog>
        );
      } else if (item.name === "info-bingo-all") {
        return (
          <ChaptLog color="gold" testAlign="center" fontSize="1rem" key={index}>
            {item.msg}
          </ChaptLog>
        );
      } else if (item.name === "info-login") {
        return (
          <ChaptLog color="gray" testAlign="center" fontSize="1rem" key={index}>
            {item.msg}
          </ChaptLog>
        );
      } else if (item.name === "info-logout") {
        return (
          <ChaptLog color="red" testAlign="center" fontSize="1rem" key={index}>
            {item.msg}
          </ChaptLog>
        );
      } else if (item.name === "info-host-change") {
        return (
          <ChaptLog
            color="green"
            testAlign="center"
            fontSize="1rem"
            key={index}
          >
            {item.msg}
          </ChaptLog>
        );
      } else if (item.name === "info-book-list") {
        return (
          <ChaptLog color="blue" testAlign="center" fontSize="1rem" key={index}>
            {item.msg}
          </ChaptLog>
        );
      } else {
        return (
          <ChaptLog color="black" testAlign="left" fontSize="1rem" key={index}>
            {item.name}: {item.msg}
          </ChaptLog>
        );
      }
    });
  };

  const renderUserList = () => {
    return UserList.map(({ id, myName, isHost }) => {
      if (isHost) {
        return (
          <UsersListLi key={id}>
            <span role="img" aria-label="crown">
              👑
            </span>{" "}
            {myName}
          </UsersListLi>
        );
      } else {
        return <UsersListLi key={id}>{myName}</UsersListLi>;
      }
    });
  };

  const scrollToBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  const handleClickOutside = (e) => {
    if (!userListButtonRef.current.contains(e.target)) {
      userListRef.current.style.display = "none";
    }
  };

  useEffect(() => {
    const socket =
      process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? io("/")
        : io("http://localhost:3001");
    socket.emit("chat connected", MyName);
    socketRef.current = socket;

    document.addEventListener("mousedown", handleClickOutside);

    msgInputRef.current.focus();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("send msg", (data) => {
      setChat([...Chat, data]);
      scrollToBottom();
    });

    return () => {
      socketRef.current.off("send msg");
    };
  }, [Chat]);

  useEffect(() => {
    socketRef.current.on("user-list", (users) => {
      setUserList(users);
    });

    return () => {
      socketRef.current.off("user-list");
    };
  }, [UserList]);

  return (
    <Container>
      <UsersBtn
        ref={userListButtonRef}
        type="button"
        onClick={() => {
          userListRef.current.style.display = "block";
        }}
      >
        Users
        <UsersListBox ref={userListRef}>
          <UsersListUl>{renderUserList()}</UsersListUl>
        </UsersListBox>
      </UsersBtn>
      <ChatLogBox ref={chatRef}>{renderChat()}</ChatLogBox>
      <ChatTypingBox>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            socketRef.current.emit("send msg", { MyName, Message });
            setMessage("");
          }}
        >
          <ChatTypingBoxInput
            ref={msgInputRef}
            type="text"
            placeholder="..."
            value={Message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <ChatTypingBoxBtn type="submit">Send</ChatTypingBoxBtn>
        </form>
      </ChatTypingBox>
    </Container>
  );
};

export default Chat;
