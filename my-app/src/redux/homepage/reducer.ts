import { ComingAuction, ComingAuctionActions, ProductDetails } from "./action";
import produce from "immer";

export interface ComingAuctionState {
    comingAuctions: ComingAuction[];
    productDetails: ProductDetails[];
}

const initialState: ComingAuctionState = {
    comingAuctions: [],
    productDetails: []
}

export function comingAuctionReducer(state: ComingAuctionState = initialState, action: ComingAuctionActions): ComingAuctionState {
    return produce(state, (newState) => {
        switch (action.type) {
            case "@@comingAuction/LOAD_COMING_AUCTION":
                newState.comingAuctions = action.comingAuctions;
                break;
            case "@@productDetails/LOAD_PRODUCT_DETAILS":
                newState.productDetails = action.productDetails;
                break;
        }
    })
}