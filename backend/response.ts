interface Achievement {
    as1: boolean;
    as2: boolean;
    as3: boolean;
    ah1: boolean;
    ah2: boolean;
    ah3: boolean;
}

interface Data {
    msg: string;
    user?: {
        id?: number;
        username?: string;
        email?: string;
        role_id?: number;
        created_at?: Date;
        updated_at?: Date;
        profile_pic?: string;
        status_id?: number;
        phone_number?: number;
        telegram_acct?: string;
        telegram_is_verified?: boolean;
        telegram_chat_id?: number;
        login_method_id?: number;
        description?:string;
    };
    queryrows?: {}[];
    queryrows2?: {}[];
    queryrows3?: {}[];
    html?: string[];
    isLoggedIn?: boolean;
    isSameUser?: boolean;
    achievement?: Achievement;
}

export interface ResponseJson {
    success?: boolean;
    data: Data;
    error?: Error;
}
