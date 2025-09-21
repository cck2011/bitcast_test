// res.json({ success: true })

// res.json(results.rows)

// res.json(results.rows[0])

// res.json({ success: false })

// res.json({ success: true, data: offeredPrice });

// res.json({ success: true, data: insertProduct.id });

// res.json({ success: true, data: searchResult.rows })

// res.json(req.session['user'])

// res.status(401).json({ msg: 'No user found' })

// res.json({ msg: 'inserted user', data: insertedUser })

// res.status(401).json({ msg: "insert fail" });



interface Data {
    msg: string;
    user?: {
        id?: number;
        alias?: string;
        email?: string;
        role?: number;
        created_at?: Date;
        updated_at?: Date;
        profile_pic?: string;
        number_tag?: number;
        profilePic?: string;
    };
    categories?:{
        id?:number;
        category?:string;
        created_at?:Date;
        updated_at?:Date;
    };
    products?:{
        id?: number;
        product_name?: string;
        live_id?: number;
        seller_id?: number;
        min_price?: number;
        current_price?: number;
        buy_price?: number;
        bidIncrement?: number;
        buyer_id?: number;
        category_id?: number;
        product_image?: string;
        is_selected?: boolean;
        countdown_start_time?: Date;
        duration?: number;
        is_ended?: boolean;
        created_by?: string;
        updated_by?: string;
        created_at?: Date;
        updated_at?: Date;
    };
    queryrows?: {}[];
    queryrows2?: {}[];
    queryrows3?: {}[];
    html?: string[];
    isLoggedIn?: boolean;
    isSameUser?: boolean;
}

export interface ResponseJson {
    success: boolean;
    data: Data;
    error?: Error;
}
