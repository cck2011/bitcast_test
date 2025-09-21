import {
    ChatMessage,
    LiveStreamActions,
    LiveStreamInfo,
    LiveStreamProduct,
    LiveStreamProductDynamicInfo,
    Recommend,
} from "./actions";
import produce from "immer";

export interface LiveStreamState {
    liveStreamInfo: LiveStreamInfo;
    liveStreamProducts: {
        liveStreamProductsArr: LiveStreamProduct[];
        liveStreamProductsArrDynamic: LiveStreamProductDynamicInfo[];
        success: boolean;
    };
    chat: {
        chatMessages: ChatMessage[];
        success: boolean;
    };
    recommendList: {
        results: Recommend[];
        success: boolean;
    };
    dummy: number;
}

const initialState: LiveStreamState = {
    liveStreamInfo: {
        id: 0,
        title: "Loading...",
        seller: "Loading...",
        sellerId: 0,
        sellerImage: "defaultUser.png",
        currentViewers: 0,
        thumbnail: "",
        description: "description",
        success: true,
    },
    liveStreamProducts: {
        liveStreamProductsArr: [],
        liveStreamProductsArrDynamic: [],
        success: true,
    },
    chat: {
        chatMessages: [],
        success: false,
    },
    recommendList: {
        results: [],
        success: false,
    },
    dummy: 0,
};

export function liveStreamReducer(
    state: LiveStreamState = initialState,
    action: LiveStreamActions
): LiveStreamState {
    return produce(state, (newState) => {
        switch (action.type) {
            case "@@liveStream/LOAD_LIVE_STREAM_INFO":
                newState.liveStreamInfo = action.liveStreamInfo;
                break;
            case "@@liveStream/LOAD_LIVE_STREAM_PRODUCTS":
                newState.liveStreamProducts.liveStreamProductsArr =
                    action.liveStreamProducts.sort((a, b) => b.id - a.id);
                newState.liveStreamProducts.success = action.success;
                break;
            case "@@liveStream/LOAD_LIVE_STREAM_PRODUCTS_DYNAMIC_INFO":
                newState.liveStreamProducts.liveStreamProductsArrDynamic =
                    action.liveStreamProductsDynamicInfo.sort(
                        (a, b) => b.id - a.id
                    );
                newState.liveStreamProducts.success = action.success;
                break;
            case "@@liveStream/SELECT_PRODUCT":
                let indSelectProduct = 0;
                for (let liveStreamProduct of newState.liveStreamProducts
                    .liveStreamProductsArrDynamic) {
                    if (liveStreamProduct.id === action.id) {
                        newState.liveStreamProducts.liveStreamProductsArrDynamic[
                            indSelectProduct
                        ].isSelected = true;
                    }
                    indSelectProduct++;
                }

                break;
            case "@@liveStream/UPDATE_PRODUCT_TIME":
                let indUpdateProductTime = 0;
                for (let liveStreamProduct of newState.liveStreamProducts
                    .liveStreamProductsArrDynamic) {
                    if (liveStreamProduct.id === action.id) {
                        newState.liveStreamProducts.liveStreamProductsArrDynamic[
                            indUpdateProductTime
                        ].countdownEndTime = action.endTime;
                    }
                    indUpdateProductTime++;
                }
                break;
            case "@@liveStream/BID_INCREMENT":
                let indUpdateBidIncrement = 0;
                for (let liveStreamProduct of newState.liveStreamProducts
                    .liveStreamProductsArrDynamic) {
                    if (liveStreamProduct.id === action.id) {
                        newState.liveStreamProducts.liveStreamProductsArrDynamic[
                            indUpdateBidIncrement
                        ].currentPrice = action.newPrice;
                        newState.liveStreamProducts.liveStreamProductsArrDynamic[
                            indUpdateBidIncrement
                        ].buyer = action.buyer;
                    }
                    indUpdateBidIncrement++;
                }
                break;
            case "@@liveStream/LOAD_CHAT_MESSAGES":
                newState.chat.chatMessages = action.chatMessages.sort(
                    (a, b) => a.id - b.id
                );
                newState.chat.success = action.success;
                break;
            case "@@liveStream/SEND_CHAT_MESSAGE":
                let created_at = new Date(
                    Date.parse(action.chatMessage.created_at)
                );
                let tempMessage = {
                    id: action.chatMessage.id,
                    username: action.chatMessage.username,
                    profile_pic: action.chatMessage.profile_pic,
                    message: action.chatMessage.message,
                    created_at,
                };
                if (newState.chat.success && action.chatMessage.success) {
                    newState.chat.chatMessages.push(tempMessage);
                }
                break;
            case "@@liveStream/LOAD_RECOMMEND_LISTS":
                newState.recommendList.results = action.recommendList;
                newState.chat.success = action.success;
                break;
            case "@@liveStream/CHANGE_DUMMY":
                newState.dummy = Math.floor(Math.random() * 10000);
                break;
            case "@@liveStream/RESET_LIVE_ID":
                newState.liveStreamInfo.id = 0;
                break;
        }
    });
}
