import React, { useEffect, useRef, useState } from "react";
import { Client, LocalStream } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { config, webSocketIP } from "../../configuration/ion-sfu";
import { ButtonGroup } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useFetch from "react-fetch-hook";
import { Canvass } from "../../pages/LiveStream/components/Konva2";
import { Socket } from "socket.io-client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaClipboard } from "../../pages/Profile-Page/component/Fontawsome";

interface LiveStreamWindowProps {
    ws: Socket | null;
}

function LiveStreamWindow(props: LiveStreamWindowProps) {
    //Get States
    const pubVideo = useRef<HTMLVideoElement>(null);
    const [client, setClient] = useState<Client | null>(null);
    let signal: IonSFUJSONRPCSignal | null = null;
    const [localStream, setLocalStream] = useState<LocalStream | null>(null);
    const token: string | null = new URLSearchParams(
        window.location.search
    ).get("token");
    const thumbnail = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.thumbnail
    );
    let [timerId, setTimerId] = useState<NodeJS.Timeout>(
        setInterval(() => {}, 45000)
    );
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );
    const username = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.username
        ) {
            return state.authState.user.username;
        }
        return "";
    });
    const seller = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.seller
    );
    //Get States

    //Custom Hook
    const result = useFetch<{ room: string }>(
        `${process.env.REACT_APP_BACKEND_URL}/room?token=${token}`
    );
    //Custom Hook

    //WebRTC Setup
    useEffect(() => {
        if (!result.isLoading && !client) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            signal = new IonSFUJSONRPCSignal(webSocketIP);
            let ClientConnection = new Client(signal, config);
            signal.onopen = () => {
                if (ClientConnection == null) {
                    return;
                }
                ClientConnection.join(`room ${result.data?.room}`, "");
            };
            setClient(ClientConnection);
            setTimerId(
                setInterval(
                    () => signal != null && signal.notify("method", "params"),
                    45000
                )
            );
        }
    }, [result]);

    useEffect(() => {
        return () => {
            if (localStream) {
                let tracks = localStream.getTracks();
                tracks.forEach(function (track) {
                    track.stop();
                });
                localStream.unpublish();
            }
        };
    }, [localStream]);

    useEffect(() => {
        return () => {
            clearInterval(timerId);
            client?.close();
            signal?.close();
        };
    }, [client, signal, timerId]);
    //WebRTC Setup

    //Broadcast button Handler
    const start = (event: boolean): void => {
        if (event) {
            LocalStream.getUserMedia({
                resolution: "vga",
                // resolution: "hd",
                audio: true,
                codec: "vp8",
            })
                .then((media) => {
                    if (pubVideo.current === null || client === null) {
                        return;
                    }
                    pubVideo.current.srcObject = media;
                    pubVideo.current.controls = true;
                    pubVideo.current.autoplay = true;
                    pubVideo.current.muted = false;
                    setLocalStream(media);
                    client.publish(media);
                })
                .catch(console.error);
        } else {
            LocalStream.getDisplayMedia({
                resolution: "vga",
                // resolution: "hd",
                video: true,
                audio: true,
                codec: "vp8",
            })
                .then((media) => {
                    if (pubVideo.current === null || client === null) {
                        return;
                    }
                    pubVideo.current.srcObject = media;
                    pubVideo.current.controls = true;
                    pubVideo.current.autoplay = true;
                    pubVideo.current.muted = false;
                    setLocalStream(media);
                    client.publish(media);
                })
                .catch(console.error);
        }
    };

    const stop = (): void => {
        if (pubVideo.current == null || localStream == null) {
            return;
        }
        let tracks = localStream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        localStream.unpublish();
        pubVideo.current.srcObject = null;
    };
    //Broadcast button Handler

    //set Copy Clip Board
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setCopyState] = useState(false);
    const onCopy = () => {
        setCopyState(true);
    };
    //set Copy Clip Board

    return (
        <div className="LiveStreamWindowSeller">
            <div className="flex flex-col h-screen relative">
                <CopyToClipboard
                    onCopy={onCopy}
                    text={`${process.env.REACT_APP_FRONTEND_URL}/liveStreaming?room=${result.data?.room}`}
                >
                    <div className="buyer_link">
                        按右邊圖示複製觀眾直播連結{" "}
                        <i className="fas fa-arrow-right"></i>{" "}
                        <span className="clipboard">
                            <FaClipboard />
                        </span>
                    </div>
                </CopyToClipboard>
                {client != null && isAuthenticate && username === seller && (
                    <ButtonGroup className="w-100">
                        <button
                            className="btn btn-primary"
                            onClick={() => start(true)}
                        >
                            鏡頭直播
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => start(false)}
                        >
                            電腦畫面直播
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => stop()}
                        >
                            停止直播
                        </button>
                    </ButtonGroup>
                )}
                <div className="video_canvas_combine">
                    {pubVideo.current !== null && (
                        <Canvass video={pubVideo} ws={props.ws} />
                    )}
                    <video
                        id="pubVideo"
                        poster="transparent.png"
                        className="w-100 h-100"
                        controls
                        ref={pubVideo}
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
                </div>
            </div>
        </div>
    );
}

export default LiveStreamWindow;
