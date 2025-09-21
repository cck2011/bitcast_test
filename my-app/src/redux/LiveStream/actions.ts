import { RootState, RootThunkDispatch } from "../../store";
import axios from "axios";
import { Socket } from "socket.io-client";

export interface LiveStreamInfo {
    id: number;
    title: string;
    seller: string;
    sellerId: number;
    sellerImage: string;
    currentViewers: number;
    thumbnail: string;
    description: string;
    success: boolean;
}

export interface LiveStreamProduct {
    id: number;
    productName: string;
    minPrice: number;
    buyPrice: number;
    bidIncrement: number;
    productImage: string;
    description?: string;
    categoryId: number;
    success: boolean;
}

export interface LiveStreamProductDynamicInfo {
    id: number;
    currentPrice: number;
    isSelected: boolean;
    buyer: string;
    countdownStartTime?: Date;
    countdownEndTime?: Date;
    duration: number;
    success: boolean;
}

interface LiveStreamProductAll {
    id: number;
    productName: string;
    minPrice: number;
    buyPrice: number;
    bidIncrement: number;
    productImage: string;
    description?: string;
    categoryId: number;
    currentPrice: number;
    isSelected: boolean;
    buyer: string;
    countdownStartTime?: string;
    countdownEndTime?: string;
    duration: number;
    success: boolean;
}

export interface UpdateProduct {
    id: number;
    newPrice?: number;
    countdownStartTime?: string;
    countdownEndTime?: string;
    duration?: number;
    buyer?: string;
    isEnded?: boolean;
    success: boolean;
}

export interface ChatMessage {
    id: number;
    username: string;
    profile_pic: string;
    message: string;
    created_at: Date;
}

export interface UpdateMessage {
    id: number;
    username: string;
    profile_pic: string;
    message: string;
    created_at: string;
    success: boolean;
}

export interface ChatMessagesResponse {
    chatMessages: ChatMessage[];
    success: boolean;
}

export interface Recommend {
    title: string;
    image: string;
    buyer_link: string;
    username: string;
}

export interface RecommendList {
    results: Recommend[];
    success: boolean;
}

export function loadliveStreamInfo(liveStreamInfo: LiveStreamInfo) {
    return {
        type: "@@liveStream/LOAD_LIVE_STREAM_INFO" as const,
        liveStreamInfo,
    };
}

export function loadLiveStreamProducts(
    liveStreamProducts: LiveStreamProduct[],
    success: boolean
) {
    return {
        type: "@@liveStream/LOAD_LIVE_STREAM_PRODUCTS" as const,
        liveStreamProducts,
        success,
    };
}

export function loadLiveStreamProductsDynamicInfo(
    liveStreamProductsDynamicInfo: LiveStreamProductDynamicInfo[],
    success: boolean
) {
    return {
        type: "@@liveStream/LOAD_LIVE_STREAM_PRODUCTS_DYNAMIC_INFO" as const,
        liveStreamProductsDynamicInfo,
        success,
    };
}

export function selectProduct(id: number) {
    return {
        type: "@@liveStream/SELECT_PRODUCT" as const,
        id,
    };
}

export function bidIncrement(id: number, newPrice: number, buyer: string) {
    return {
        type: "@@liveStream/BID_INCREMENT" as const,
        id,
        newPrice,
        buyer,
    };
}

export function updateProductTime(id: number, endTime: Date) {
    return {
        type: "@@liveStream/UPDATE_PRODUCT_TIME" as const,
        id,
        endTime,
    };
}

export function loadChatMessages(
    chatMessages: ChatMessage[],
    success: boolean
) {
    return {
        type: "@@liveStream/LOAD_CHAT_MESSAGES" as const,
        chatMessages,
        success,
    };
}

export function sendChatMessages(chatMessage: UpdateMessage) {
    return {
        type: "@@liveStream/SEND_CHAT_MESSAGE" as const,
        chatMessage,
    };
}

export function loadRecommendList(
    recommendList: Recommend[],
    success: boolean
) {
    return {
        type: "@@liveStream/LOAD_RECOMMEND_LISTS" as const,
        recommendList,
        success,
    };
}

export function changeDummy() {
    return {
        type: "@@liveStream/CHANGE_DUMMY" as const,
    };
}

export function resetLiveId() {
    return {
        type: "@@liveStream/RESET_LIVE_ID" as const,
    };
}

export type LiveStreamActions =
    | ReturnType<typeof loadliveStreamInfo>
    | ReturnType<typeof loadLiveStreamProducts>
    | ReturnType<typeof loadLiveStreamProductsDynamicInfo>
    | ReturnType<typeof bidIncrement>
    | ReturnType<typeof selectProduct>
    | ReturnType<typeof updateProductTime>
    | ReturnType<typeof loadChatMessages>
    | ReturnType<typeof sendChatMessages>
    | ReturnType<typeof loadRecommendList>
    | ReturnType<typeof changeDummy>
    | ReturnType<typeof resetLiveId>;

export function fetchliveStreamInfo(room: string, token: string) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await axios.get<LiveStreamInfo>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/info?room=${room}&token=${token}`
            );

            if (res.data.success) {
                dispatch(loadliveStreamInfo(res.data));
            } else {
                dispatch(
                    loadliveStreamInfo({
                        id: -1,
                        title: "Error",
                        seller: "Error",
                        sellerId: 0,
                        sellerImage: "defaultUser.png",
                        currentViewers: 0,
                        thumbnail: "",
                        description: "",
                        success: false,
                    })
                );
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchliveStreamProducts(liveId: number, isFull: boolean) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await axios.get<{
                liveStreamProducts: LiveStreamProductAll[];
                success: boolean;
            }>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/products?liveId=${liveId}`
            );

            if (res.data.success) {
                const liveStreamProducts: LiveStreamProduct[] = [];
                const liveStreamProductsDynamicInfo: LiveStreamProductDynamicInfo[] =
                    [];
                for (let product of res.data.liveStreamProducts) {
                    let productObj: LiveStreamProduct = {
                        id: 0,
                        productName: "",
                        minPrice: 0,
                        buyPrice: 0,
                        bidIncrement: 0,
                        productImage: "",
                        description: "",
                        categoryId: 0,
                        success: false,
                    };
                    let productObjDynamic: LiveStreamProductDynamicInfo = {
                        id: 0,
                        currentPrice: 0,
                        isSelected: false,
                        buyer: "",
                        duration: 0,
                        success: false,
                    };

                    productObj.id = product.id;
                    productObjDynamic.id = product.id;
                    productObj.productName = product.productName;
                    productObj.minPrice = product.minPrice;
                    productObjDynamic.currentPrice = product.currentPrice;
                    productObj.buyPrice = product.buyPrice;
                    productObj.bidIncrement = product.bidIncrement;
                    productObj.productImage = product.productImage;
                    productObjDynamic.isSelected = product.isSelected;
                    productObjDynamic.duration = product.duration;
                    if (product.countdownEndTime) {
                        productObjDynamic.countdownEndTime = new Date(
                            Date.parse(product.countdownEndTime)
                        );
                    }
                    productObj.description = product.description;
                    productObj.categoryId = product.categoryId;
                    productObjDynamic.buyer = product.buyer;
                    liveStreamProducts.push(productObj);
                    liveStreamProductsDynamicInfo.push(productObjDynamic);
                }

                if (isFull) {
                    dispatch(
                        loadLiveStreamProducts(
                            liveStreamProducts,
                            res.data.success
                        )
                    );
                }

                dispatch(
                    loadLiveStreamProductsDynamicInfo(
                        liveStreamProductsDynamicInfo,
                        res.data.success
                    )
                );
            } else {
                dispatch(loadLiveStreamProducts([], false));
                dispatch(loadLiveStreamProductsDynamicInfo([], false));
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchBidIncrement(
    productId: number,
    bidAmount: number,
    ws: Socket,
    liveId: number,
    addCurrentPrice: boolean
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const token = localStorage.getItem("token");

            if (token == null) {
                return;
            }

            const res = await axios.put<UpdateProduct>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/products/currentPrice`,
                {
                    productId,
                    bidAmount,
                    addCurrentPrice,
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            if (res.data.success) {
                if (res.data.newPrice && res.data.buyer) {
                    dispatch(
                        bidIncrement(
                            productId,
                            res.data.newPrice,
                            res.data.buyer
                        )
                    );
                    if (ws) {
                        ws.emit("updateCurrentPrice", liveId, res.data.isEnded);
                    }
                }
            } else {
                if (ws) {
                    ws.emit("updateCurrentPriceFail", res.data.newPrice);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchSelectedProduct(
    productId: number,
    ws: Socket,
    liveId: number
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const token = localStorage.getItem("token");

            if (token == null) {
                return;
            }

            let liveStreamProductsArrDynamic =
                getState().liveStream.liveStreamProducts
                    .liveStreamProductsArrDynamic;
            let now = new Date();
            let isBidding = false;
            for (let product of liveStreamProductsArrDynamic) {
                if (
                    product.countdownEndTime &&
                    now <= product.countdownEndTime
                ) {
                    isBidding = true;
                }
            }

            if (!isBidding) {
                const res = await axios.put<UpdateProduct>(
                    `${process.env.REACT_APP_BACKEND_URL}/liveStream/products/isSelected`,
                    {
                        productId,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );

                if (res.data.success) {
                    dispatch(selectProduct(res.data.id));
                    if (ws) {
                        ws.emit("render", [liveId, productId]);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchProductTime(
    productId: number,
    seconds: number,
    setTimerId: React.Dispatch<React.SetStateAction<number>>,
    ws: Socket,
    liveId: number
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const token = localStorage.getItem("token");

            if (token == null) {
                return;
            }

            const res = await axios.put<UpdateProduct>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/products/productTime`,
                {
                    productId,
                    seconds,
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (res.data.success) {
                if (res.data.countdownEndTime) {
                    dispatch(
                        updateProductTime(
                            res.data.id,
                            new Date(Date.parse(res.data.countdownEndTime))
                        )
                    );
                    setTimerId(0);
                    if (ws) {
                        ws.emit("startBid", liveId);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchInitialChatMessages(liveId: number) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await axios.get<ChatMessagesResponse>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/chatMessage?liveId=${liveId}`
            );
            if (res.data.success) {
                dispatch(
                    loadChatMessages(res.data.chatMessages, res.data.success)
                );
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchChatMessages(
    ws: Socket,
    liveId: number,
    message: string = ""
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            if (message === "") {
                return;
            }
            const token = localStorage.getItem("token");

            if (token == null) {
                return;
            }

            const res = await axios.post<UpdateMessage>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/chatMessage`,
                { liveId, message },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (res.data.success) {
                if (ws) {
                    ws.emit(
                        "sendMessage",
                        liveId.toString() + "chatroom",
                        res.data
                    );
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function fetchSameCategoryLive(
    liveId: number,
    categoryIdSet: Set<number>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const categoryIdArr = Array.from(categoryIdSet);
            let categoryId = categoryIdArr.join(",");
            if (categoryId === "") {
                return;
            }
            const res = await axios.get<RecommendList>(
                `${process.env.REACT_APP_BACKEND_URL}/liveStream/otherLives?category=${categoryId}&liveId=${liveId}`
            );
            if (res.data.success) {
                dispatch(loadRecommendList(res.data.results, res.data.success));
                window.setTimeout(() => {
                    setIsLoading(false);
                }, 200);
            }
        } catch (e) {
            console.log(e);
        }
    };
}
