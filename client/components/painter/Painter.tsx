import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Chat from "../chat/Chat";
import { useStore } from "../../stores/StoreProvider";
import { WHITE_PNG, WorkMemory, canvasImgSetting } from "../../utils/utils";
import { ko_pack } from "../../utils/localization/lang_packs";
import io from "socket.io-client";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100%;
`;

const TitleBox = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
  text-align: center;
`;

const DrawingBox = styled.div`
  position: relative;
`;

const ToolBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3px;
  padding: 3px;
  border-radius: 10px;
  width: 350px;

  background-color: white;
`;

const ToolBoxInput = styled.input`
  width: 78%;
  margin-right: 5px;
  border: 1px solid black;
  padding: 3px;

  &: disabled {
    display: none;
  }
`;

const ToolBoxBtn = styled.button`
  width: 30px;
  height: 20px;
  margin-right: 5px;
  border: none;
  cursor: pointer;
  background-color: transparent;
  transition: transform 0.3s;

  &: disabled {
    display: none;
  }

  &: active {
    transform: translateY(15%);
  }

  &: focus {
    outline: 0;
  }
`;

const ResetBtn = styled(ToolBoxBtn)`
  background-image: url("./icons/reset-icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  color: transparent;

  &: active {
    transform: rotate(1turn);
  }
`;

const EraserBtn = styled(ToolBoxBtn)`
  background-image: url("./icons/eraser.svg");
  background-repeat: no-repeat;
  background-position: center;
  color: transparent;
`;

const PalletOpenBtn = styled(ToolBoxBtn)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 20px;

  border: 1px solid black;
  border-radius: 50%;

  font-size: 0.7rem;

  color: transparent;
  background-color: transparent;
  background-image: url("./icons/palette_icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const PalletWrapper = styled.div`
  display: none;
  position: absolute;
  top: -180%;
  left: -180%;

  width: 230px;
  height: 25px;

  border: 1px solid black;
  border-radius: 10px;

  padding: 2px;
  background-color: whitesmoke;
`;

const PalletColorDiv = styled.div`
  border-radius: 50%;
  color: transparent;
  background-color: ${(props) => props.color};
`;

const ArrowBtn = styled(ToolBoxBtn)`
  height: 20px;
  background-image: url(${(props) => props.resource});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  color: transparent;
  cursor: pointer;
`;

const A = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  background-image: url("./icons/save_icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  color: transparent;
  cursor: pointer;
`;

const SendAnsBox = styled.div`
  display: flex;
`;

const SendAnsBoxBtn = styled(ToolBoxBtn)`
  border: 1px solid black;
  border-radius: 50%;
  padding: 3px;
  width: 25px;
  height: 25px;
  font-size: 0.5rem;
  margin-right: 0;
  margin-left: 0;
`;

const NonHostBox = styled.div``;

const BookingBtn = styled.button`
  width: 60px;
  height: 22px;
  margin: 3px;
  border: 0;
  border-bottom: 1px solid black;
  font-size: 0.8rem;
`;

const {
  PAINTER_TITLE_TURN,
  PAINTER_TITLE_GUESS,
  PAINTER_BOOKING_BUTTON,
  PAINTER_PROMPT_MSG,
  ANS_INPUT_PLACEHOLDER,
} = ko_pack;

const workMemory = new WorkMemory();
const Time = "";

const Painter = () => {
  // canvas
  const router = useRouter();
  const { userStore } = useStore();
  const { nickname, invicode, isAuth } = userStore;
  const MyName = nickname;

  const [IsMyTurn, setIsMyTurn] = useState(false);
  const [Answer, setAnswer] = useState("");
  const [Eraser_flag, setEraser_flag] = useState(false);
  const [PenColor, setPenColor] = useState("black");

  const socketRef = useRef<any>();
  const myCanvasRef = useRef<HTMLCanvasElement>();
  const eraserButtonRef = useRef<HTMLButtonElement>();
  const paletteOpenButtonRef = useRef<HTMLButtonElement>();
  const paletteRef = useRef<HTMLDivElement>();
  const saveAnchorRef = useRef<HTMLAnchorElement>();

  const handleClickOutside = (e) => {
    if (!paletteOpenButtonRef.current.contains(e.target)) {
      paletteRef.current.style.display = "none";
    }
  };

  // canvas init
  useEffect(() => {
    const myCanvas = myCanvasRef.current;
    const myCtx = myCanvas.getContext("2d");

    myCtx.fillStyle = "white";
    myCtx.fillRect(0, 0, myCanvasRef.current.width, myCanvasRef.current.height);

    myCanvas.addEventListener(
      "touchstart",
      function (e) {
        if (e.target === myCanvasRef.current) {
          e.preventDefault();
        }
      },
      false
    );
    myCanvas.addEventListener(
      "touchend",
      function (e) {
        if (e.target === myCanvasRef.current) {
          e.preventDefault();
        }
      },
      false
    );
    myCanvas.addEventListener(
      "touchmove",
      function (e) {
        if (e.target === myCanvasRef.current) {
          e.preventDefault();
        }
      },
      false
    );

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // socket init
  useEffect(() => {
    const socket =
      process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? io("/")
        : io("http://localhost:3001");
    console.log(process.env.NEXT_PUBLIC_NODE_ENV);
    socket.on("connect", () => {
      console.log("socket connected - ", socket.id);
    });

    const myName = nickname;
    const code = invicode;
    socket.emit("login", { myName, code });

    socketRef.current = socket;

    window.onpopstate = (e) => {
      // router.go(0);
      // alert("페이지를 이동하면 진행상황을 잃게 됩니다!");
      // socket.close();
      // return e.returnValue;
    };

    window.onbeforeunload = (e) => {
      return e.returnValue;
    };

    return () => {
      socket.removeAllListeners();
      socket.close();
      window.onbeforeunload = (e) => {};
    };
  }, []);

  useEffect(() => {
    const myName = MyName;
    const code = invicode;

    socketRef.current.on("random ans", (randomAns) => {
      setAnswer(randomAns);
    });
    socketRef.current.on("disconnect", () => {
      // console.log("try reconnecting");
      // socket.open();
    });

    return () => {
      socketRef.current.off("random ans");
      socketRef.current.off("disconnect");
    };
  }, [MyName, router]);

  useEffect(() => {
    if (!IsMyTurn) {
      socketRef.current.on("cashing image", (cashedImage) => {
        canvasImgSetting(myCanvasRef.current, cashedImage);
      });
    }
    console.log("state IsMyTurn - ", IsMyTurn);

    return () => {
      socketRef.current.off("cashing image");
    };
  }, [IsMyTurn]);

  useEffect(() => {
    socketRef.current.on("myTurn", (myTurn) => {
      setPenColor("black");
      workMemory.init();

      if (myTurn === true) {
        setIsMyTurn(true);
        setTimeout(() => {
          socketRef.current.emit("random ans");
        }, 100);
      } else {
        setIsMyTurn(false);
      }
      console.log("myTurn(event from server)", myTurn);
    });

    const myCanvas = myCanvasRef.current;
    const myCtx = myCanvas.getContext("2d");

    socketRef.current.on("reset canvas", () => {
      myCtx.fillStyle = "white";
      myCtx.fillRect(
        0,
        0,
        myCanvasRef.current.width,
        myCanvasRef.current.height
      );
    });

    let prevX = 0;
    let prevY = 0;
    let currX = 0;
    let currY = 0;

    let forXCorrection = myCanvas.getBoundingClientRect().left;
    let forYCorrection = myCanvas.getBoundingClientRect().top;

    let path_flag = false;
    const drawing = (type, e, IsMyTurn, eraser_flag, color, x?, y?) => {
      if (eraser_flag === false) {
        myCtx.fillStyle = color;
        myCtx.strokeStyle = color;
        myCtx.lineWidth = 3;
      } else {
        myCtx.fillStyle = "white";
        myCtx.strokeStyle = "white";
        myCtx.lineWidth = 15;
      }

      const rectWidth = 3;
      myCtx.lineJoin = "round";
      myCtx.lineCap = "round";

      prevX = currX;
      prevY = currY;
      if (IsMyTurn === true) {
        currX = e.clientX - forXCorrection;
        currY = e.clientY - forYCorrection;
      } else {
        currX = x;
        currY = y;
      }

      if (type === "down") {
        path_flag = true;
        myCtx.fillRect(currX, currY, rectWidth, rectWidth);

        // for sending data
        const data = {
          currX,
          currY,
          Eraser_flag,
          type: "down",
          color: PenColor,
        };

        if (IsMyTurn === true) {
          socketRef.current.emit("send data", data);
        }
      } else if (type === "move" && path_flag) {
        myCtx.beginPath();
        myCtx.moveTo(prevX, prevY);
        myCtx.lineTo(currX, currY);
        myCtx.stroke();
        myCtx.closePath();

        // for sending data
        const data = {
          currX,
          currY,
          Eraser_flag,
          type: "move",
          color: PenColor,
        };

        if (IsMyTurn === true) {
          socketRef.current.emit("send data", data);
        }
      } else if (type === "up" || type === "out") {
        path_flag = false;

        if (type === "up" && IsMyTurn === true) {
          setTimeout(() => {
            const cashingImage = myCanvasRef.current.toDataURL();
            socketRef.current.emit("cashing image", {
              cashingImage: cashingImage,
              type: "normal",
            });
            workMemory.saving(cashingImage);
          }, 100);
        }
      }
    };

    const mousedownListener = (e) => {
      drawing("down", e, IsMyTurn, Eraser_flag, PenColor);
    };

    const mousemoveListener = (e) => {
      drawing("move", e, IsMyTurn, Eraser_flag, PenColor);
    };

    const mouseupListener = (e) => {
      drawing("up", e, IsMyTurn, Eraser_flag, PenColor);
    };

    const mouseoutListener = (e) => {
      drawing("out", e, IsMyTurn, Eraser_flag, PenColor);
    };

    const touchstartListener = (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      myCanvas.dispatchEvent(mouseEvent);
    };
    const touchendListener = (e) => {
      const mouseEvent = new MouseEvent("mouseup", {});
      myCanvas.dispatchEvent(mouseEvent);
    };
    const touchmoveListener = (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      myCanvas.dispatchEvent(mouseEvent);
    };

    const resizeAndScrollListener = () => {
      forXCorrection = myCanvas.getBoundingClientRect().left;
      forYCorrection = myCanvas.getBoundingClientRect().top;
    };

    if (IsMyTurn === true) {
      window.addEventListener("resize", resizeAndScrollListener);
      window.addEventListener("scroll", resizeAndScrollListener);
      myCanvas.addEventListener("mousedown", mousedownListener);
      myCanvas.addEventListener("mousemove", mousemoveListener);
      myCanvas.addEventListener("mouseup", mouseupListener);
      myCanvas.addEventListener("mouseout", mouseoutListener);
      myCanvas.addEventListener("touchstart", touchstartListener);
      myCanvas.addEventListener("touchend", touchendListener);
      myCanvas.addEventListener("touchmove", touchmoveListener);
    }

    socketRef.current.on("send data", (data) => {
      drawing(
        data.type,
        null,
        IsMyTurn,
        data.Eraser_flag,
        data.color,
        data.currX,
        data.currY
      );
    });

    return () => {
      window.removeEventListener("resize", resizeAndScrollListener);
      window.removeEventListener("scroll", resizeAndScrollListener);
      myCanvas.removeEventListener("mousedown", mousedownListener);
      myCanvas.removeEventListener("mousemove", mousemoveListener);
      myCanvas.removeEventListener("mouseup", mouseupListener);
      myCanvas.removeEventListener("mouseout", mouseoutListener);
      myCanvas.removeEventListener("touchstart", touchstartListener);
      myCanvas.removeEventListener("touchend", touchendListener);
      myCanvas.removeEventListener("touchmove", touchmoveListener);

      socketRef.current.off("send data");
      socketRef.current.off("myTurn");
      socketRef.current.off("reset canvas");
    };
  }, [Eraser_flag, IsMyTurn, PenColor]);

  if (!isAuth) {
    router.push("/");
  }

  return (
    <Container>
      <TitleBox>
        <h2>
          {IsMyTurn
            ? `${MyName}, ${PAINTER_TITLE_TURN} ${Time}`
            : `${MyName}, ${PAINTER_TITLE_GUESS} ${Time}`}
        </h2>
      </TitleBox>
      <DrawingBox>
        <canvas ref={myCanvasRef} id="myCanvas" width="350" height="350">
          Error
        </canvas>
      </DrawingBox>
      <ToolBox>
        <ResetBtn
          disabled={!IsMyTurn}
          type="button"
          onClick={() => {
            const myCtx = myCanvasRef.current.getContext("2d");
            myCtx.fillStyle = "white";
            myCtx.fillRect(
              0,
              0,
              myCanvasRef.current.width,
              myCanvasRef.current.height
            );
            socketRef.current.emit("reset canvas");

            const cashingImage = myCanvasRef.current.toDataURL();
            socketRef.current.emit("cashing image", {
              cashingImage: cashingImage,
              type: "normal",
            });
            workMemory.saving(cashingImage);
          }}
        >
          Reset
        </ResetBtn>
        <EraserBtn
          ref={eraserButtonRef}
          disabled={!IsMyTurn}
          type="button"
          onClick={() => {
            if (Eraser_flag) {
              setEraser_flag(false);
              eraserButtonRef.current.style.backgroundImage =
                "url('/icons/eraser.svg')";
            } else {
              setEraser_flag(true);
              eraserButtonRef.current.style.backgroundImage =
                "url('/icons/pen.svg')";
            }
          }}
        >
          {Eraser_flag ? "Pen" : "Eraser"}
        </EraserBtn>
        <PalletOpenBtn
          disabled={!IsMyTurn}
          ref={paletteOpenButtonRef}
          type="button"
          onClick={() => {
            if (paletteRef.current.style.display === "flex") {
              paletteRef.current.style.display = "none";
              return;
            }
            paletteRef.current.style.display = "flex";
            paletteRef.current.style.flexFlow = "row";
            paletteRef.current.style.justifyContent = "space-evenly";
          }}
        >
          Color
          <PalletWrapper ref={paletteRef}>
            <PalletColorDiv
              color="black"
              onClick={() => {
                setPenColor("black");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="red"
              onClick={() => {
                setPenColor("red");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="blue"
              onClick={() => {
                setPenColor("blue");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="skyblue"
              onClick={() => {
                setPenColor("skyblue");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="green"
              onClick={() => {
                setPenColor("green");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="purple"
              onClick={() => {
                setPenColor("purple");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="yellow"
              onClick={() => {
                setPenColor("yellow");
              }}
            >
              color
            </PalletColorDiv>
            <PalletColorDiv
              color="brown"
              onClick={() => {
                setPenColor("brown");
              }}
            >
              color
            </PalletColorDiv>
          </PalletWrapper>
        </PalletOpenBtn>
        <ArrowBtn
          resource="./icons/arrow_left_icon.svg"
          disabled={!IsMyTurn}
          type="button"
          onClick={() => {
            const flag = workMemory.moveToPrev((prev) => {
              canvasImgSetting(myCanvasRef.current, prev);
              socketRef.current.emit("cashing image", {
                cashingImage: prev,
                type: "restoring",
              });
            });
            if (flag === "end") {
            }
          }}
        >
          Prev
        </ArrowBtn>
        <ArrowBtn
          resource="./icons/arrow_right_icon.svg"
          disabled={!IsMyTurn}
          type="button"
          onClick={() => {
            const flag = workMemory.moveToNext((next) => {
              canvasImgSetting(myCanvasRef.current, next);
              socketRef.current.emit("cashing image", {
                cashingImage: next,
                type: "restoring",
              });
            });
            if (flag === "end") {
            }
          }}
        >
          Next
        </ArrowBtn>
        <ToolBoxBtn>
          <A
            ref={saveAnchorRef}
            href={WHITE_PNG}
            onClick={() => {
              const url = myCanvasRef.current.toDataURL("image/png");
              const link = saveAnchorRef.current;
              link.download = Answer ? `${Answer}.png` : "canvasImage.png";
              link.href = url;

              if (Answer !== "" && IsMyTurn) {
                socketRef.current.emit("db-create", {
                  title: Answer,
                  content: url,
                });
              }
            }}
          >
            save
          </A>
        </ToolBoxBtn>

        <SendAnsBox className="send-ans-box">
          <ToolBoxInput
            disabled={!IsMyTurn}
            type="text"
            maxLength={7}
            value={Answer}
            placeholder={ANS_INPUT_PLACEHOLDER}
            onChange={(e) => {
              const answerFromHost = e.target.value;
              setAnswer(answerFromHost);
              socketRef.current.emit("send answer", answerFromHost);
            }}
          />
          <SendAnsBoxBtn
            disabled={!IsMyTurn}
            type="button"
            onClick={() => {
              socketRef.current.emit("random ans");
            }}
          >
            ?
          </SendAnsBoxBtn>
        </SendAnsBox>

        <NonHostBox>
          <ToolBoxBtn
            disabled={IsMyTurn}
            type="button"
            onClick={() => {
              const Message = "👍";
              socketRef.current.emit("send msg", { MyName, Message });
            }}
          >
            <span role="img" aria-label="Like">
              👍
            </span>
          </ToolBoxBtn>
          <BookingBtn
            className="booking-btn"
            disabled={IsMyTurn}
            onClick={() => {
              socketRef.current.emit("book host", MyName);
            }}
          >
            {PAINTER_BOOKING_BUTTON}
          </BookingBtn>
        </NonHostBox>
      </ToolBox>
      <Chat MyName={MyName} />
    </Container>
  );
};

export default Painter;
