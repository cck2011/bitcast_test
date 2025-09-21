import { RootState, RootThunkDispatch } from "../../store"

export interface BroadcastingProducts {
    id: number;
    title: string;
    current_price: number;
    username: string;
    product_name: string;
    image: string;
    min_price: number;
    buyer_link: string;
    seller_id: number;
}

export function loadBroadcastingProducts(
    broadcastingProducts: BroadcastingProducts[]
) {
    return {
        type: "@@products/LOAD_BROADCASTING_PRODUCTS" as const,
        broadcastingProducts,
    }
}

export type BroadcastingProductActions = ReturnType<typeof loadBroadcastingProducts>

export function fetchBroadcastingProducts() {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/broadcastingProduct`
            )
            const json = await res.json()

            if (json) {
                // console.log("json.data.results.rows", json.data.results.rows);
                dispatch(loadBroadcastingProducts(json.data.results.rows.slice(0, 9)))
            } else {
                dispatch(loadBroadcastingProducts([]))
            }
        } catch (error) {
            console.log(error);

        }
    }
}