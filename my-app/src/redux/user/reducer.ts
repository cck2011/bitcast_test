import produce from "immer";
import {
    UserActions,
    AuthActions,
    FollowerActions,
    FollowingActions,
    sellerFollowerActions,
    UserCardInfo,
} from "./actions";
import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";

export interface UserState {
    isAuthenticate: boolean;
    // userId: string | null;
    token: string | null;
}

const initialState: UserState = {
    isAuthenticate: false,
    // userId: null,
    token: null,
};

const loadTokenInitalState: AuthState = {
    user: {},
    error: "",
};

export type AuthState = {
    user?: JWTPayload | string;
    error?: string;
};

export type JWTPayload = {
    id?: number;
    username?: string;
    email?: string;
    role_id?: number;
    created_at?: Date;
    updated_at?: Date;
    profile_pic?: string;
    status_id?: number;
    phone_number?: string;
    telegram_acct?: string;
    telegram_is_verified?: boolean;
    telegram_chat_id?: number;
    login_method_id?: number;
    description?: string;
};
export interface sellerFollowerState {
    sellerId: number[];
    liveRecord: number[];
}
export interface FollowerState {
    userId: number[];
    userDetails: UserCardInfo[];
    success: boolean;
}

export interface FollowingState {
    userId: number[];
    userDetails: UserCardInfo[];
    success: boolean;
}
const sellerFollowerInitalState: sellerFollowerState = {
    sellerId: [],
    liveRecord: []
}

const followerInitalState: FollowerState = {
    userId: [],
    userDetails: [],
    success: false,
};
const followingInitalState: FollowingState = {
    userId: [],
    userDetails: [],
    success: false,
};

export function sellerFollowerReducer(
    state: sellerFollowerState = sellerFollowerInitalState,
    action: sellerFollowerActions
): sellerFollowerState {
    return produce(state, (newState) => {
        if (action.type === "@@sellerFollower/LOAD_SELLERFOLLOWER") {
            newState.sellerId = action.sellerId;
            newState.liveRecord = action.liveRecord;
        }
    });
}

export function followerReducer(
    state: FollowerState = followerInitalState,
    action: FollowerActions
): FollowerState {
    return produce(state, (newState) => {
        switch (action.type) {
            case "@@follower/LOAD_FOLLOWER":
                newState.userId = action.userId;
                newState.success = action.success;
                break;
            case "@@follower/LOAD_FOLLOWER_DETAILS":
                newState.userDetails = action.userDetails;
                break;
        }
    });
}
export function followingReducer(
    state: FollowingState = followingInitalState,
    action: FollowingActions
): FollowingState {
    return produce(state, (newState) => {
        switch (action.type) {
            case "@@following/LOAD_FOLLOWING":
                newState.userId = action.userId;
                newState.success = action.success;
                break;
            case "@@following/LOAD_FOLLOWING_DETAILS":
                newState.userDetails = action.userDetails;
                break;
        }
    });
}

export function userReducer(
    state: UserState = initialState,
    action: UserActions
): UserState {
    return produce(state, (state) => {
        if (action.type === "@@user/LOGIN") {
            state.token = action.token;
            state.isAuthenticate = true;
        } else if (action.type === "@@user/LOGOUT") {
            state.token = null;
            state.isAuthenticate = false;
        }
    });
}

export let authReducer = (
    state: AuthState = loadTokenInitalState,
    action: AuthActions
): AuthState => {
    return produce(state, (state) => {
        switch (action.type) {
            case "@@Auth/load_token":
                try {
                    const verifyOptions: VerifyOptions = {
                        maxAge: "12h",
                        algorithms: ["RS512"],
                    };

                    let publicKey = process.env.REACT_APP_PUBLIC_KEY!.replace(
                        /\\n/g,
                        "\n"
                    );
                    let payload: string | JwtPayload | any = jwt.verify(
                        action.token,
                        publicKey,
                        verifyOptions
                    );
                    // console.log('payload= ', payload)
                    const user: JWTPayload = {
                        id: payload.id,
                        username: payload.username,
                        email: payload.email,
                        created_at: payload.created_at,
                        login_method_id: payload.login_method_id,
                        phone_number: payload.phone_number,
                        profile_pic: payload.profile_pic,
                        role_id: payload.role_id,
                        status_id: payload.status_id,
                        telegram_acct: payload.telegram_acct,
                        telegram_chat_id: payload.telegram_chat_id,
                        telegram_is_verified: payload.telegram_is_verified,
                        updated_at: payload.updated_at,
                        description: payload.description,
                    };
                    return {
                        user,
                        error: undefined,
                    };
                } catch (error) {
                    return {
                        error: "invalid JWT Token",
                        user: undefined,
                    };
                }
            default:
                return state;
        }
    });
};
