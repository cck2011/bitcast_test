import produce from "immer";
import { UtilityActions } from "./actions";

export interface UtilityState {
    sidebarCollapse: boolean;
    menuCollapse: boolean;
    isClicking: boolean;
}

const initialState: UtilityState = {
    sidebarCollapse: true,
    menuCollapse: true,
    isClicking: false,
};

export function utilityReducer(
    state: UtilityState = initialState,
    action: UtilityActions
): UtilityState {
    return produce(state, (newState) => {
        switch (action.type) {
            case "@@utility/SIDEBAR_ONCLICK":
                newState.sidebarCollapse = action.isCollapse;
                break;
            case "@@utility/MENU_ICON_ONCLICK":
                newState.menuCollapse = action.isCollapse;
                newState.isClicking = action.isClicking;
                break;
        }
    });
}
