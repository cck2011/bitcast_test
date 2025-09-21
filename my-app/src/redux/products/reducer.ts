import produce from "immer";
import { Category, Product, ProductsActions } from "./actions";

export interface ProductsState {
    products: {
        [id: string]: Product;
    };
    categories: {
        [id: string]: Category;
    };
}

const initialState: ProductsState = {
    products: {},
    categories: {
        // '1': {
        //   id: 1,
        //   name: '電子產品',
        //   order: 99,
        //   productIds: [1, 2]
        // },
        // '2': {
        //   id: 1,
        //   name: '時尚服飾',
        //   order: 1,
        //   productIds: [3, 4]
        // },
    },
};

export function productsReducer(
    state: ProductsState = initialState,
    action: ProductsActions
): ProductsState {
    //fetch ser 拎 categories data

    return produce(state, (newState) => {

        switch (action.type) {
            case "@@products/LOAD_CATEGORIES":
                for (let category of action.categories) {
                    newState.categories[category.id] = category;
                }
                break;
            //fetch ser 拎 products data
        }
    });
}
