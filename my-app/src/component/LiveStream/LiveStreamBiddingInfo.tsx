import { CToaster } from "@coreui/react";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Socket } from "socket.io-client";
import {
    fetchBidIncrement,
    fetchliveStreamProducts,
    LiveStreamProduct,
    LiveStreamProductDynamicInfo,
} from "../../redux/LiveStream/actions";
import { RootState } from "../../store";
import ErrorCannotDoubleBid from "./ErrorCannotDoubleBid";
import ErrorCannotSelfBid from "./ErrorCannotSelfBid";
import ErrorPriceTooLow from "./ErrorPriceTooLow";
import ErrorUnknown from "./ErrorUnknown";
import InputPhoneNumber from "./InputPhoneNumber";
import Login from "./Login";

interface LiveStreamBiddingInfoProps {
    ws: Socket | null;
}

function LiveStreamBiddingInfo(props: LiveStreamBiddingInfoProps) {
    //Get States
    const dispatch = useDispatch();
    const [remainingTime, setRemainingTime] = useState<number>(Infinity);
    const [inputPrice, setInputPrice] = useState<number>(0);
    const [isBidding, setIsBidding] = useState<boolean>(true);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [timerId, setTimerId] = useState<number>(0);
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );

    const phoneNumber = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.phone_number
        ) {
            return state.authState.user?.phone_number;
        }
        return "";
    });

    const liveId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.id
    );

    const products = useSelector(
        (state: RootState) =>
            state.liveStream.liveStreamProducts.liveStreamProductsArr
    );

    const productsDynamic = useSelector(
        (state: RootState) =>
            state.liveStream.liveStreamProducts.liveStreamProductsArrDynamic
    );

    const [selectedProduct, setSelectedProduct] = useState<LiveStreamProduct>({
        id: 0,
        productName: "",
        minPrice: 0,
        buyPrice: 0,
        bidIncrement: 0,
        productImage: "",
        description: "",
        categoryId: 0,
        success: false,
    });

    const [selectedProductDynamic, setSelectedProductDynamic] =
        useState<LiveStreamProductDynamicInfo>({
            id: 0,
            currentPrice: 0,
            isSelected: false,
            buyer: "",
            duration: 0,
            success: false,
        });

    useEffect(() => {
        if (
            inputPrice <=
            selectedProductDynamic.currentPrice +
                selectedProduct.bidIncrement -
                1
        ) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [
        inputPrice,
        selectedProductDynamic.currentPrice,
        selectedProduct.bidIncrement,
    ]);
    const [toast, addToast] = useState<JSX.Element>(<></>);
    const toaster = useRef<HTMLDivElement>(null);
    const responsive = useMediaQuery({
        query: "(min-width: 420px)",
    });
    //Get States

    //Countdown End Handler
    useEffect(() => {
        return () => {
            if (remainingTime <= 0) {
                clearInterval(timerId);
                setIsBidding(false);
                setTimerId(0);
            }
        };
    }, [remainingTime, timerId]);
    //Countdown End Handler

    //Countdown Start Handler
    useEffect(() => {
        if (
            productsDynamic.length !== 0 &&
            products.length !== 0 &&
            productsDynamic.length === products.length
        ) {
            for (let ind in products) {
                let countdownEndTime = productsDynamic[ind].countdownEndTime;
                if (
                    productsDynamic[ind].isSelected &&
                    countdownEndTime !== undefined &&
                    countdownEndTime > new Date()
                ) {
                    setSelectedProduct(products[ind]);
                    setSelectedProductDynamic(productsDynamic[ind]);
                    setIsBidding(true);
                    setRemainingTime(
                        Math.ceil(
                            (countdownEndTime!.getTime() -
                                new Date().getTime()) /
                                1000
                        )
                    );
                    if (timerId === 0) {
                        setTimerId(
                            window.setInterval(() => {
                                setRemainingTime(
                                    Math.ceil(
                                        (countdownEndTime!.getTime() -
                                            new Date().getTime()) /
                                            1000
                                    )
                                );
                            }, 33)
                        );
                    }
                    break;
                } else if (
                    productsDynamic[ind].isSelected &&
                    countdownEndTime !== undefined &&
                    countdownEndTime <= new Date()
                ) {
                    clearInterval(timerId);
                    setTimerId(0);
                    setSelectedProduct(products[ind]);
                    setSelectedProductDynamic(productsDynamic[ind]);
                    setIsBidding(false);
                    break;
                } else if (
                    productsDynamic[ind].isSelected &&
                    countdownEndTime === undefined
                ) {
                    clearInterval(timerId);
                    setTimerId(0);
                    setSelectedProduct(products[ind]);
                    setSelectedProductDynamic(productsDynamic[ind]);
                    setIsBidding(false);
                    break;
                }
            }
        }
    }, [products, productsDynamic, timerId]);
    //Countdown Start Handler

    //WebSocket Signal Handler
    useEffect(() => {
        if (props.ws) {
            props.ws.on("startBid", (liveId: number) => {
                dispatch(fetchliveStreamProducts(liveId, false));
            });
            props.ws.on(
                "updateCurrentPrice",
                (liveId: number, isEnded: boolean) => {
                    dispatch(fetchliveStreamProducts(liveId, false));
                    if (isEnded) {
                        setRemainingTime(-100);
                    }
                }
            );
            props.ws.on("updateCurrentPriceFail", (code: number) => {
                if (code === 0) {
                    addToast(<ErrorCannotSelfBid />);
                } else if (code === -10) {
                    addToast(<ErrorPriceTooLow />);
                } else if (code === -20) {
                    addToast(<ErrorCannotDoubleBid />);
                } else if (code === -30) {
                    addToast(<ErrorUnknown />);
                }
            });
        }
    }, [dispatch, props.ws]);
    //WebSocket Signal Handler

    //Button On Click Handler
    const minBidIncrement = () => {
        if (props.ws) {
            dispatch(
                fetchBidIncrement(
                    selectedProduct.id,
                    selectedProduct.bidIncrement,
                    props.ws,
                    liveId,
                    true
                )
            );
        }
    };
    const customBidIncrement = () => {
        if (
            props.ws &&
            inputPrice >=
                selectedProductDynamic.currentPrice +
                    selectedProduct.bidIncrement
        ) {
            dispatch(
                fetchBidIncrement(
                    selectedProduct.id,
                    inputPrice,
                    props.ws,
                    liveId,
                    false
                )
            );
        }
    };
    const maxBidIncrement = () => {
        if (props.ws) {
            dispatch(
                fetchBidIncrement(
                    selectedProduct.id,
                    1000000000000000000000000,
                    props.ws,
                    liveId,
                    false
                )
            );
        }
    };
    //Button On Click Handler

    return (
        <div className="LiveStreamBiddingInfo h-100 rounded my-3">
            {!isAuthenticate ? (
                <Login message={"請先登入再進行拍賣"} />
            ) : phoneNumber !== "" && phoneNumber !== "11111111" ? (
                <div className="info w-100 h-100 d-flex justify-contens-center align-items-center flex-column">
                    <div className="row">
                        <div className="col-12 d-flex flex-row justify-content-center align-items-center w-100 h-100 mb-5">
                            <img
                                key={selectedProduct.id}
                                className={`selected_img me-4`}
                                src={selectedProduct.productImage}
                                alt={`pic${selectedProduct.id}`}
                            />
                            <div className="instant_info d-flex flex-column">
                                <div
                                    className={`${
                                        responsive
                                            ? "current_price"
                                            : "responsive_current_price"
                                    } ms-4`}
                                >
                                    <i className="fas fa-money-bill-wave"></i>{" "}
                                    現在價格:
                                    <br /> $
                                    {selectedProductDynamic.currentPrice}
                                    <br />
                                    <span className="highest_bid_user mb-3">
                                        最高出價者:{" "}
                                        {selectedProductDynamic.buyer == null ||
                                        selectedProductDynamic.buyer === ""
                                            ? "ー"
                                            : selectedProductDynamic.buyer}
                                    </span>
                                </div>
                                {!isBidding &&
                                selectedProductDynamic.countdownEndTime ===
                                    undefined ? (
                                    <div
                                        className={`${
                                            responsive
                                                ? "remaining_time"
                                                : "responsive_remaining_time"
                                        } mt-2 ms-4`}
                                    >
                                        拍賣尚未開始
                                    </div>
                                ) : !isBidding &&
                                  selectedProductDynamic.countdownEndTime !==
                                      undefined ? (
                                    <div
                                        className={`${
                                            responsive
                                                ? "remaining_time"
                                                : "responsive_remaining_time"
                                        } mt-2 ms-4`}
                                    >
                                        拍賣已結束
                                    </div>
                                ) : (
                                    <div
                                        className={`${
                                            responsive
                                                ? "remaining_time"
                                                : "responsive_remaining_time"
                                        } mt-2 ms-4 text-center`}
                                    >
                                        <i className="fas fa-hourglass-half"></i>
                                        {""}剩餘 {remainingTime} 秒
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bid_btn_groups row g-0 w-100 my-3">
                        <div className="col-8">
                            <button
                                disabled={!isBidding || remainingTime <= 10}
                                className={`min_bid btn btn-danger mb-1 w-100 ${
                                    !isBidding && "unavailable_btn"
                                }`}
                                onClick={minBidIncrement}
                            >
                                <i className="fas fa-gavel"></i> 最低叫價
                                <br />
                                (一口叫價為${selectedProduct.bidIncrement})
                            </button>
                            <button
                                disabled={!isBidding || isDisabled}
                                className={`custom_bid btn btn-primary mb-1 w-100 ${
                                    (!isBidding || isDisabled) &&
                                    "unavailable_btn"
                                }`}
                                onClick={customBidIncrement}
                            >
                                <i className="fas fa-gavel"></i> 自訂叫價
                            </button>
                            <label className="w-100">
                                <input
                                    type="number"
                                    className="action_duration w-100 text-end"
                                    value={inputPrice}
                                    onChange={(e) => {
                                        setInputPrice(parseInt(e.target.value));
                                    }}
                                    onKeyDown={(
                                        e: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                        if (e.key === "Enter") {
                                            customBidIncrement();
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="col-4">
                            <button
                                disabled={!isBidding}
                                className={`custom_bid btn btn-success ms-1 w-100 h-100 ${
                                    !isBidding && "unavailable_btn"
                                }`}
                                onClick={maxBidIncrement}
                            >
                                <i className="fas fa-gavel"></i> 即買價
                                <br />
                                (${selectedProduct.buyPrice})
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <InputPhoneNumber />
            )}

            <CToaster ref={toaster} push={toast} placement="bottom-end" />
        </div>
    );
}

export default LiveStreamBiddingInfo;
