import React, { useEffect, useRef, useState } from "react";
import "./LiveStream.scss";
import LiveStreamWindow from "../../component/LiveStream/LiveStreamWindow";
import LiveStreamControlPanel from "../../component/LiveStream/LiveStreamControlPanel";
import LiveStreamChatRoom from "../../component/LiveStream/LiveStreamChatRoom";
import LiveStreamRecommend from "../../component/LiveStream/LiveStreamRecommend";
import LiveStreamHeader from "../../component/LiveStream/LiveStreamHeader";
import { useMediaQuery } from "react-responsive";
import { Button, ButtonGroup } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    changeDummy,
    fetchInitialChatMessages,
    fetchliveStreamInfo,
    fetchliveStreamProducts,
    fetchSameCategoryLive,
    resetLiveId,
} from "../../redux/LiveStream/actions";
import { RootState } from "../../store";
import io, { Socket } from "socket.io-client";
import LiveStreamBiddingInfo from "../../component/LiveStream/LiveStreamBiddingInfo";
import Four0Four from "../four0Four/four0Four";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface LiveStreamProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function LiveStream(props: LiveStreamProps) {
    //Get States
    const dispatch = useDispatch();
    const liveStreamRef = useRef<HTMLDivElement>(null);
    let roomForQRcode = new URLSearchParams(window.location.search).get("room");
    roomForQRcode = roomForQRcode != null ? roomForQRcode : "";

    useEffect(() => {
        let room = new URLSearchParams(window.location.search).get("room");
        room = room != null ? room : "";
        let token = new URLSearchParams(window.location.search).get("token");
        token = token != null ? token : "";

        dispatch(fetchliveStreamInfo(room, token));
        return () => {
            dispatch(resetLiveId());
        };
    }, [dispatch]);

    const liveId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.id
    );

    useEffect(() => {
        if (liveId !== 0) {
            dispatch(fetchliveStreamProducts(liveId, true));
            dispatch(fetchInitialChatMessages(liveId));
        }
    }, [dispatch, liveId]);

    const recommendProducts = useSelector(
        (state: RootState) =>
            state.liveStream.liveStreamProducts.liveStreamProductsArr
    );

    useEffect(() => {
        let categoryIdSet = new Set<number>();
        for (let product of recommendProducts) {
            categoryIdSet.add(product.categoryId);
        }
        dispatch(
            fetchSameCategoryLive(liveId, categoryIdSet, props.setIsLoading)
        );
    }, [dispatch, recommendProducts, liveId, props]);

    useEffect(() => {
        if (liveId === 0) {
            props.setIsLoading(true);
        } else if (liveId === -1) {
            props.setIsLoading(false);
        }
    }, [props, liveId]);
    //Get States

    //Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    //Scroll to top

    //React-responsive
    const isDesktop = useMediaQuery({
        query: "(min-width: 1200px)",
    });
    const isTablet = useMediaQuery({
        query: "(min-width: 768px)",
    });
    const [page, setPage] = useState<number>(1);
    //React-responsive

    //Websocket Setup
    const [ws, setWs] = useState<Socket | null>(null);

    const connectWebSocket = () => {
        if (process.env.REACT_APP_BACKEND_URL !== undefined) {
            setWs(io(process.env.REACT_APP_BACKEND_URL));
        }
    };

    if (liveId > 0 && ws === null) {
        connectWebSocket();
    }

    useEffect(() => {
        if (ws) {
            const initWebSocket = () => {
                if (ws) {
                    ws.emit("joinRoom", liveId);
                    ws.on("render", () => {
                        dispatch(fetchliveStreamProducts(liveId, false));
                    });
                    ws.emit("checkOnlineUsers", liveId);
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
    //Websocket Setup

    //Add event listener
    useEffect(() => {
        const popstaeHandler = () => {
            dispatch(changeDummy());
        };
        window.addEventListener("popstate", popstaeHandler);
        return () => {
            window.removeEventListener("popstate", popstaeHandler);
        };
    }, [dispatch]);
    //Add event listener

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [copyState, setCopyState] = useState(false);
    const onCopy = () => {
        setCopyState(true);
    };

    return (
        <>
            {liveId === -1 ? (
                <Four0Four />
            ) : (
                <div className="LiveStream m-3" ref={liveStreamRef}>
                    <div className="row">
                        <div className={`${isTablet ? "col-8" : "col"}`}>
                            <LiveStreamWindow ws={ws} />
                            {isTablet ? (
                                <>
                                    <div className="row mt-3 rounded">
                                        <div className={`col-12`}>
                                            <div>
                                                <LiveStreamBiddingInfo
                                                    ws={ws}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <LiveStreamControlPanel
                                        isDesktop={isDesktop}
                                        isTablet={isTablet}
                                        ws={ws}
                                    />
                                    <LiveStreamHeader ws={ws} />
                                </>
                            ) : (
                                <>
                                    <ButtonGroup className="w-100">
                                        <Button
                                            className="page_btn"
                                            onClick={() => setPage(1)}
                                        >
                                            直播資料
                                        </Button>
                                        <Button
                                            className="page_btn"
                                            onClick={() => setPage(2)}
                                        >
                                            拍賣設定
                                        </Button>
                                        <Button
                                            className="page_btn"
                                            onClick={() => setPage(3)}
                                        >
                                            聊天室
                                        </Button>
                                        <Button
                                            className="page_btn"
                                            onClick={() => setPage(4)}
                                        >
                                            其他拍賣直播
                                        </Button>
                                    </ButtonGroup>
                                    {page === 1 && <LiveStreamHeader ws={ws} />}
                                    {page === 2 && (
                                        <>
                                            <div className="row mt-3 rounded">
                                                <div className={`col-12`}>
                                                    <LiveStreamBiddingInfo
                                                        ws={ws}
                                                    />
                                                </div>
                                            </div>
                                            <LiveStreamControlPanel
                                                isDesktop={isDesktop}
                                                isTablet={isTablet}
                                                ws={ws}
                                            />
                                        </>
                                    )}
                                    {page === 3 && (
                                        <LiveStreamChatRoom
                                            liveStreamRef={liveStreamRef}
                                            isTablet={isTablet}
                                        />
                                    )}
                                    {page === 4 && (
                                        <LiveStreamRecommend
                                            setIsLoading={props.setIsLoading}
                                        />
                                    )}
                                </>
                            )}
                            <div className={"buyerLink_QRcode"}>
                                <CopyToClipboard
                                    onCopy={onCopy}
                                    text={`${process.env.REACT_APP_FRONTEND_URL}/liveStreaming?room=${roomForQRcode}`}
                                >
                                    <QRCode
                                        value={`${process.env.REACT_APP_FRONTEND_URL}/liveStreaming?room=${roomForQRcode}`}
                                        className={"QRcode_pic"}
                                    />
                                </CopyToClipboard>
                                <div>
                                    <span>此拍賣頁連結QR code</span>
                                    <ul>
                                        <li>手機掃描QR code即可打開</li>
                                        <li>點擊圖案，複制連結並分享</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {isTablet && (
                            <div className="col-4">
                                <div className="row">
                                    <div className="col">
                                        <LiveStreamChatRoom
                                            liveStreamRef={liveStreamRef}
                                            isTablet={isTablet}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <LiveStreamRecommend
                                            setIsLoading={props.setIsLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default LiveStream;
