import {
    connectRouter,
    RouterAction,
    routerMiddleware,
    RouterState,
} from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import {
    userReducer,
    UserState,
    AuthState,
    authReducer,
    FollowerState,
    FollowingState,
    followerReducer,
    followingReducer,
    sellerFollowerState,
    sellerFollowerReducer,
} from "./redux/user/reducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import {
    UserActions,
    AuthActions,
    FollowerActions,
    FollowingActions,
    sellerFollowerActions,
} from "./redux/user/actions";
import { createBidsReducer } from "./redux/createbid/reducer";
import { productsReducer, ProductsState } from "./redux/products/reducer";
import { liveStreamReducer, LiveStreamState } from "./redux/LiveStream/reducer";
import { LiveStreamActions } from "./redux/LiveStream/actions";
import { ProductsActions } from "./redux/products/actions";
import { CreateBids, createBidsActions } from "./redux/createbid/actions";
import { ComingAuctionActions } from "./redux/homepage/action";
import {
    comingAuctionReducer,
    ComingAuctionState,
} from "./redux/homepage/reducer";
import { SearchProductsActions } from "./redux/searchResult/action";
import { productSearchReducer, ProductSearchState } from "./redux/searchResult/reducer";
import { LoadMyLiveActions } from "./redux/myLiveProducts/action";
import { myLiveReducer, MyLiveState } from "./redux/myLiveProducts/reducer";
// import { LoadMyLiveProductsActions } from "./redux/myLiveProducts/action";
// import {
//     myLiveProductsReducer,
//     MyLiveProductsState,
// } from "./redux/myLiveProducts/reducer";
import { BroadcastingProductActions } from "./redux/broadcastingProducts/actions";
import {
    broadcastingProductReducer,
    BroadcastProductState,
} from "./redux/broadcastingProducts/reducer";
import { UtilityActions } from "./redux/utility/actions";
import { utilityReducer, UtilityState } from "./redux/utility/reducer";

export const history = createBrowserHistory();

export type RootAction =
    | RouterAction
    | UserActions
    | ProductsActions
    | LiveStreamActions
    | createBidsActions
    | ComingAuctionActions
    | SearchProductsActions
    | LoadMyLiveActions
    | BroadcastingProductActions
    | UtilityActions
    | AuthActions
    | sellerFollowerActions
    | FollowerActions
    | FollowingActions;

export type RootThunkDispatch = ThunkDispatch<RootState, null, RootAction>;

export interface RootState {
    user: UserState;
    router: RouterState;
    CreateBids: CreateBids;
    products: ProductsState;
    liveStream: LiveStreamState;
    comingAuction: ComingAuctionState;
    authState: AuthState;
    searchProduct: ProductSearchState;
    myLive: MyLiveState;
    broadcastingProducts: BroadcastProductState;
    utility: UtilityState;
    loadToken: AuthState;
    follower: FollowerState;
    following: FollowingState;
    sellerFollower: sellerFollowerState;
}

const reducer = combineReducers<RootState>({
    user: userReducer,
    CreateBids: createBidsReducer,
    products: productsReducer,
    router: connectRouter(history),
    liveStream: liveStreamReducer,
    comingAuction: comingAuctionReducer,
    authState: authReducer,
    searchProduct: productSearchReducer,
    myLive: myLiveReducer,
    broadcastingProducts: broadcastingProductReducer,
    utility: utilityReducer,
    loadToken: authReducer,
    follower: followerReducer,
    following: followingReducer,
    sellerFollower: sellerFollowerReducer, 
});

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(routerMiddleware(history)),
        applyMiddleware(thunk)
    )
);
