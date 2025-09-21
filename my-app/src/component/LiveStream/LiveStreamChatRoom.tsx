import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomScroll from "react-custom-scroll";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import {
    fetchChatMessages,
    sendChatMessages,
    UpdateMessage,
} from "../../redux/LiveStream/actions";
import { RootState } from "../../store";

interface LiveStreamChatRoomProps {
    liveStreamRef: React.RefObject<HTMLDivElement>;
    isTablet: boolean;
}

function getRandomColor() {
    var letters = "456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function LiveStreamChatRoom(props: LiveStreamChatRoomProps) {
    //Get States
    const dispatch = useDispatch();
    const [inputMessage, setInputMessage] = useState<string>("");
    const liveId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.id
    );
    const messages = useSelector(
        (state: RootState) => state.liveStream.chat.chatMessages
    );
    const [color, setColor] = useState<string[]>(["#000000"]);
    useEffect(() => {
        let colorArr = [];
        for (let ind = 0; ind < 10; ind++) {
            colorArr.push(getRandomColor());
        }
        setColor(colorArr);
    }, []);
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );

    //Get States

    //Scroll button
    const messagesRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const containerHeight = event.currentTarget.clientHeight;
        const scrollHeight = event.currentTarget.scrollHeight;

        const scrollTop = event.currentTarget.scrollTop;
        setIsVisible(scrollTop + containerHeight < scrollHeight ? true : false);
    };

    const scrollToBottom = () => {
        messagesRef.current?.parentElement?.parentElement?.scrollTo({
            top: messagesRef.current?.scrollHeight,
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);
    //Scroll button

    //Drag function
    const [size, setSize] = useState<number>(0);
    const dragRef = useRef<HTMLDivElement>(null);

    const dragHandler = useCallback(() => {
        function onMouseMove(e: MouseEvent) {
            setSize((currentSize) => currentSize + e.movementY);
        }
        function onMouseUp() {
            props.liveStreamRef?.current?.removeEventListener(
                "mousemove",
                onMouseMove
            );
            props.liveStreamRef?.current?.removeEventListener(
                "mouseup",
                onMouseUp
            );
        }
        props.liveStreamRef?.current?.addEventListener(
            "mousemove",
            onMouseMove
        );
        props.liveStreamRef?.current?.addEventListener("mouseup", onMouseUp);
    }, [props.liveStreamRef]);
    //Drag function

    //Chatroom mobile mode resize
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height,
        };
    }

    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    //Chatroom mobile mode resize

    //Send Message Handler
    const sendMessageHandler = (inputMessage: string) => {
        if (ws) {
            dispatch(fetchChatMessages(ws, liveId, inputMessage));
        }
    };
    //Send Message Handler

    //WebSocket Signal Handler
    const [ws, setWs] = useState<Socket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            if (process.env.REACT_APP_BACKEND_URL !== undefined) {
                setWs(io(process.env.REACT_APP_BACKEND_URL));
            }
        };

        if (liveId > 0 && ws === null) {
            connectWebSocket();
        }

        if (ws && liveId > 0) {
            const initWebSocket = () => {
                if (ws) {
                    ws.emit("joinRoom", liveId.toString() + "chatroom");
                    ws.on("sendMessage", (message: UpdateMessage) => {
                        dispatch(sendChatMessages(message));
                    });
                }
            };
            initWebSocket();
        }
    }, [dispatch, ws, liveId]);

    useEffect(() => {
        return () => {
            ws?.close();
        };
    }, [ws]);

    return (
        <div className="LiveStreamChatRoom">
            <div
                className="LiveStreamChatRoomMainBody p-3"
                style={
                    props.isTablet
                        ? { height: `${658 + size}px`, minHeight: "200px" }
                        : {
                              height: `${
                                  windowDimensions.height -
                                  windowDimensions.width / 2 -
                                  175
                              }px`,
                          }
                }
            >
                <div className="chat">
                    <div className="head text-center">聊天室</div>
                    <CustomScroll
                        className="customScroll"
                        keepAtBottom={true}
                        onScroll={scrollHandler}
                    >
                        <div
                            className="messages"
                            style={
                                props.isTablet
                                    ? {
                                          height: `${535 + size}px`,
                                          minHeight: "77px",
                                      }
                                    : {
                                          height: `${
                                              windowDimensions.height -
                                              windowDimensions.width / 2 -
                                              300
                                          }px`,
                                      }
                            }
                            ref={messagesRef}
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`msg${
                                        i % 2 !== 0 ? " dark" : ""
                                    } pe-3 mt-1 mx-1 d-flex`}
                                >
                                    <img
                                        className="chat_propic rounded-circle me-1"
                                        src={`${
                                            m.profile_pic.search(
                                                /(https:\/\/)|(http:\/\/)/i
                                            ) < 0
                                                ? process.env
                                                      .REACT_APP_BACKEND_URL +
                                                  "/" +
                                                  m.profile_pic
                                                : m.profile_pic
                                        }`}
                                        alt={`profile pic ${m.username}`}
                                    />
                                    <div>
                                        <span
                                            className="chat_username me-2"
                                            style={{
                                                color: color[
                                                    m.username.length %
                                                        color.length
                                                ],
                                            }}
                                        >
                                            {m.username}
                                        </span>
                                        {m.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CustomScroll>
                    <div className="dummyLayer">
                        {isVisible && (
                            <button
                                className="scrollToBottom btn btn-primary rounded-circle"
                                onClick={scrollToBottom}
                                style={{}}
                            >
                                <i className="fas fa-arrow-down"></i>
                            </button>
                        )}
                    </div>
                    {isAuthenticate ? (
                        <div className="footer d-flex mb-3">
                            <input
                                className="inputBox w-100"
                                type="text"
                                placeholder="請在此輸入留言..."
                                value={inputMessage}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setInputMessage(e.target.value)}
                                onKeyDown={(
                                    e: React.KeyboardEvent<HTMLInputElement>
                                ) => {
                                    if (e.key === "Enter") {
                                        sendMessageHandler(inputMessage);
                                        setInputMessage("");
                                    }
                                }}
                            />
                            <div className="position-relative">
                                <button
                                    className="sendBtn ripple"
                                    onClick={() => {
                                        sendMessageHandler(inputMessage);
                                        setInputMessage("");
                                    }}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="login_message mt-2 text-center">
                            需先登入才可留言
                        </div>
                    )}
                </div>
            </div>
            {props.isTablet && (
                <div
                    className="dragBtn text-center px-3"
                    ref={dragRef}
                    onMouseDown={dragHandler}
                >
                    <i className="fas fa-arrows-alt-v"></i>{" "}
                    按此拉動滑鼠調整聊天室長度
                </div>
            )}
        </div>
    );
}

export default LiveStreamChatRoom;
