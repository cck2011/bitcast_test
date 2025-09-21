import produce from "immer";
import { BroadcastingProductActions, BroadcastingProducts } from "./actions";


export interface BroadcastProductState {
    broadcastingProduct: BroadcastingProducts[]
}

const initialState: BroadcastProductState = {
    broadcastingProduct: []
}

export function broadcastingProductReducer(
    state: BroadcastProductState = initialState,
    action: BroadcastingProductActions
): BroadcastProductState {
    return produce(state, (newState) => {
        switch (action.type) {
            case "@@products/LOAD_BROADCASTING_PRODUCTS":
                newState.broadcastingProduct = action.broadcastingProducts
        }
    })
}