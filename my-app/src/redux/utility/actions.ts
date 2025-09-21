export function sidebarClick(isCollapse: boolean) {
    return {
        type: "@@utility/SIDEBAR_ONCLICK" as const,
        isCollapse,
    };
}

export function menuIconClick(isCollapse: boolean, isClicking: boolean) {
    return {
        type: "@@utility/MENU_ICON_ONCLICK" as const,
        isCollapse,
        isClicking,
    };
}

export type UtilityActions =
    | ReturnType<typeof sidebarClick>
    | ReturnType<typeof menuIconClick>;
