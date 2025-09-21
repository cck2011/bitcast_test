import { RootState, RootThunkDispatch } from "../../store";

export interface MyLive {
    id: number;
    user_id: number;
    title: string;
    image: string;
    starting_time: Date;
    seller_link: string;
    max_viewers?: number;
    is_ended?: boolean;
    is_live?: boolean;
}

export interface MyLiveProducts {
    id: number;
    product_name: string;
    seller_id: number;
    min_price: number;
    buy_price: number;
    bid_increment: number;
    buyer_id: number;
    title: string;
    live_id: number;
    username: string;
    email: string;
    phone_number: number;
    current_price: number;
    product_image: string;
    starting_time: Date;
    telegram_acct: string;
}

export function loadMyLive(myLive: MyLive[]) {
    return {
        type: "@@myLive/LOAD_MY_LIVE" as const,
        myLive,
    };
}

export function loadMyLiveProducts(myLiveProducts: MyLiveProducts[]) {
    return {
        type: "@@myLive/LOAD_MY_LIVE_PRODUCTS" as const,
        myLiveProducts,
    };
}

export function loadLiveStatus(liveId: MyLive[]) {
    return {
        type: "@@myLive/LOAD_LIVE_STATUS" as const,
        liveId,
    }
}

export function loadOpenLiveStatus(myLiveId: MyLive[]) {
    return {
        type: "@@myLive/LOAD_OPEN_LIVE_STATUS" as const,
        myLiveId,
    }
}

export function loadSoldProducts(myLiveProducts: MyLiveProducts[]) {
    return {
        type: "@@myLive/LOAD_SOLD_PRODUCTS" as const,
        myLiveProducts,
    }
}

export type LoadMyLiveActions = ReturnType<typeof loadMyLive>
    | ReturnType<typeof loadMyLiveProducts>
    | ReturnType<typeof loadLiveStatus>
    | ReturnType<typeof loadOpenLiveStatus>
    | ReturnType<typeof loadSoldProducts>


export function fetchMyLive() {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/profilePage/myLive`
            );

            const json = await res.json();

            if (json) {
                dispatch(loadMyLive(json.data.results.rows));
            } else {
                dispatch(loadMyLive([]));
            }
        } catch (error) {
            console.log(error);
        }
    };
}
export function fetchSoldProducts(
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadState: React.Dispatch<React.SetStateAction<number>>
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/profilePage/mySoldHistory`
            );

            const json = await res.json();

            if (json) {
                dispatch(loadSoldProducts(json.data.results.rows));
            } else {
                dispatch(loadSoldProducts([]));
            }
            setIsLoading(false);
            setLoadState((loadState) => loadState + 1);
        } catch (error) {
            console.log(error);
        }
    };
}

export function fetchMyLiveProducts(
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadState: React.Dispatch<React.SetStateAction<number>>
) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/profilePage/myLiveProducts`
            );

            const json = await res.json();

            if (json) {
                dispatch(loadMyLiveProducts(json.data.results.rows));
            } else {
                dispatch(loadMyLiveProducts([]));
            }
            setIsLoading(false);
            setLoadState((loadState) => loadState + 1);
        } catch (error) {
            console.log(error);
        }
    }
}

export function updateLiveStatus(liveId: number) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/profilePage/liveIsEnded`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",

                },
                body: JSON.stringify({ liveId })
            }
            )
            const json = await res.json()
            if (json.success) {
                dispatch(loadLiveStatus(json.data.results))
            }


        } catch (error) {
            console.log(error);

        }
    }
}

export function updateOpenLiveStatus(myLiveId: number) {
    return async (dispatch: RootThunkDispatch, getState: () => RootState) => {
        try {

            const res = await fetch(

                `${process.env.REACT_APP_BACKEND_URL}/profilePage/openMyLive`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",

                },
                body: JSON.stringify({ myLiveId })
            }
            )

            const json = await res.json()
            if (json.success) {

                dispatch(loadOpenLiveStatus(json.data.results))
            }

        } catch (error) {
            console.log(error);

        }
    }
}
