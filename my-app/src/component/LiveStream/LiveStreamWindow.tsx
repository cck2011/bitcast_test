import React, { useEffect, useRef } from "react";
import { Client } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { config, webSocketIP } from "../../configuration/ion-sfu";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Canvass } from "../../pages/LiveStream/components/Konva2";
import { Socket } from "socket.io-client";

interface LiveStreamWindowProps {
    ws: Socket | null;
}

function LiveStreamWindow(props: LiveStreamWindowProps) {
    //Get States
    const subVideo = useRef<HTMLVideoElement>(null);
    let client: Client | null = null;
    let signal: IonSFUJSONRPCSignal | null = null;
    const room: string | null = new URLSearchParams(window.location.search).get(
        "room"
    );
    const thumbnail = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.thumbnail
    );
    const liveId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.id
    );
    //Get States

    //WebRTC Setup
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        signal = new IonSFUJSONRPCSignal(webSocketIP);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        client = new Client(signal, config);
        signal.onopen = () => {
            if (client == null) {
                return;
            }
            client.join(`room ${room}`, "");
        };
        let timerId: NodeJS.Timeout = setInterval(() => {}, 10000);
        setTimeout(() => {
            timerId = setInterval(
                () => signal != null && signal.notify("method", "params"),
                10000
            );
        }, 10000);

        client.ontrack = (track, stream) => {
            track.onunmute = () => {
                if (subVideo.current === null) {
                    return;
                }
                subVideo.current.srcObject = stream;
                subVideo.current.controls = true;
                subVideo.current.autoplay = true;
                subVideo.current.muted = false;

                stream.onremovetrack = () => {
                    if (subVideo.current === null) {
                        return;
                    }
                    subVideo.current.srcObject = null;
                };
            };
        };

        return clearInterval(timerId);
    }, []);
    //WebRTC Setup

    //starOnClickHandler
    const starOnClickHandler = () => {
        if (props.ws && liveId !== null) {
            props.ws.emit("starOnClick", liveId);
        }
    };
    const heartOnClickHandler = () => {
        if (props.ws && liveId !== null) {
            props.ws.emit("heartOnClick", liveId);
        }
    };
    //starOnClickHandler

    return (
        <div className="LiveStreamWindow">
            <div className="flex flex-col h-screen relative">
                <div className="video_canvas_combine">
                    {subVideo.current !== null && (
                        <Canvass video={subVideo} ws={props.ws} />
                    )}
                    <video
                        id="subVideo"
                        poster="transparent.png"
                        className="w-100 h-100"
                        controls
                        ref={subVideo}
                        style={{
                            backgroundImage: `${
                                thumbnail
                                    ? `url("${process.env.REACT_APP_BACKEND_URL}/${thumbnail}")`
                                    : ""
                            }`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "100% 100%",
                        }}
                    ></video>
                    <div className="star-button" onClick={starOnClickHandler}>
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="heart-button" onClick={heartOnClickHandler}>
                        <i className="fas fa-heart"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveStreamWindow;
