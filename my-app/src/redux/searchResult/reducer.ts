import { CategoriesFilter, ProductFilter, SearchProduct, SearchProductsActions } from "./action";
import produce from "immer";

export interface ProductSearchState {
    productList: SearchProduct[]
    categories: CategoriesFilter[]
    productFilter: ProductFilter[]
}

const initialState: ProductSearchState = {
    productList: [],
    categories: [],
    productFilter: [],
}

export function productSearchReducer(
    state: ProductSearchState = initialState,
    action: SearchProductsActions
): ProductSearchState {
    return produce(state, (newState) => {

        switch (action.type) {
            case "@@products/LOAD_PRODUCT_SEARCH_RESULT":
                // console.log("newState", newState.productList)
                newState.productList = action.productList
                break;
            case "@@products/SORT_BY_DATE":
                newState.productList = action.sortByDates
                const searchResults = [...newState.productList]
                searchResults.sort((a, b) => a.starting_time > b.starting_time ? 1 : -1)
                break;
            case "@@products/LOAD_PRODUCT_CATEGORIES":
                newState.categories = action.categories
                break;
            case "@@products/LOAD_PRODUCT_FOR_FILTER":
                newState.productFilter = action.productFilter
                break;
        }
    })
}
