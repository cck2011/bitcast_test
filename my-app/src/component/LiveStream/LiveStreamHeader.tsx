import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Socket } from "socket.io-client";
import { RootState } from "../../store";
import SubscribeButton from "../common/subscribeButton";

interface LiveStreamHeaderProps {
    ws: Socket | null;
}

function LiveStreamHeader(props: LiveStreamHeaderProps) {
    //Get States
    const title = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.title
    );
    const seller = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.seller
    );
    const sellerId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.sellerId
    );
    const sellerImage = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.sellerImage
    );
    const description = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.description
    );
    const liveId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.id
    );
    const userId = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.id
        ) {
            return state.authState.user?.id;
        }
        return 0;
    });
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );
    const [onlineUsers, setOnlineUsers] = useState<number>(0);
    const [timerId, setTimerId] = useState<number>(0);
    const responsive = useMediaQuery({
        query: "(min-width: 420px)",
    });
    //Get States

    //WebSocket Signal Handler
    useEffect(() => {
        if (timerId === 0) {
            if (props.ws) {
                setTimerId(
                    window.setInterval(() => {
                        if (props.ws) {
                            props.ws.emit("checkOnlineUsers", liveId);
                        }
                    }, 10000)
                );
                props.ws.on("checkOnlineUsers", (clientsInRoom: number) => {
                    setOnlineUsers(clientsInRoom);
                });
            }
        }

        return () => {
            clearInterval(timerId);
        };
    }, [props.ws, timerId, liveId]);
    //WebSocket Signal Handler

    return (
        <div className="LiveStreamHeader px-3">
            <div className="mainInfo">
                <div className="row">
                    <div className="col-md-10 col-8">
                        <div
                            className={`${
                                responsive ? "title" : "responsive_title"
                            } my-3`}
                        >
                            {title}
                        </div>
                    </div>
                    {isAuthenticate && (
                        <div className="col-md-2 col-4 d-flex align-items-center justify-content-end">
                            <SubscribeButton
                                targetId={sellerId}
                                userId={userId}
                            />
                        </div>
                    )}
                </div>
                <div className="userinfo d-flex align-items-center mb-4">
                    <img
                        className="profilePic rounded-circle"
                        src={`${
                            sellerImage.search(/(https:\/\/)|(http:\/\/)/i) < 0
                                ? process.env.REACT_APP_BACKEND_URL +
                                  "/" +
                                  sellerImage
                                : sellerImage
                        }`}
                        alt="profilePic"
                    />
                    <div className="username mx-3">{seller}</div>

                    <div className="viewers">
                        {responsive && "正在觀看人數"} {onlineUsers}{" "}
                        <i className="fas fa-user-friends"></i>
                    </div>
                </div>
                <div className="description m-3 mb-5">{description}</div>
            </div>
        </div>
    );
}

export default LiveStreamHeader;
