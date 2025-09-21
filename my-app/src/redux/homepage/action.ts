import { RootState, RootThunkDispatch } from "../../store";

export interface ComingAuction {
    id: number;
    product_name: string;
    min_price: number;
    image: string;
    starting_time: Date;
    username: string;
    category: string;
    buy_price: number;
    description: string;
    title: string;
    user_id: number;
    profile_pic: string;
    buyer_link: string;
}

export interface ProductDetails {
    id: number;
    live_id: number;
    product_name: string;
    min_price: number;
    buy_price: number;
    product_image: string;
}

export function loadComingAuctions(comingAuctions: ComingAuction[]) {
    return {
        type: "@@comingAuction/LOAD_COMING_AUCTION" as const,
        comingAuctions,
    };
}

export function loadProductDetails(productDetails: ProductDetails[]) {
    return {
        type: "@@productDetails/LOAD_PRODUCT_DETAILS" as const,
        productDetails,
    };
}

export type ComingAuctionActions =
    | ReturnType<typeof loadComingAuctions>
    | ReturnType<typeof loadProductDetails>;

export function getComingAuctions(
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadState: React.Dispatch<React.SetStateAction<number>>
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/comingAuction`
            );

            const json = await res.json();

            if (json) {
                dispatch(loadComingAuctions(json.data.results.rows));
            } else {
                dispatch(loadComingAuctions([]));
            }
            window.setTimeout(() => {
                setIsLoading(false);
                setLoadState((loadState) => loadState + 1);
            }, 300);
        } catch (error) {
            console.log(error);
        }
    };
}

export function fetchProductDetails() {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/product/details`
            );

            const json = await res.json();

            if (json) {
                dispatch(loadProductDetails(json.data.results.rows));
            } else {
                dispatch(loadProductDetails([]));
            }
        } catch (error) {
            console.log(error);
        }
    };
}
