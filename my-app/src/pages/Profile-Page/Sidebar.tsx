import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./Profilepage.scss";
import {
    FiLogOut,
    FiArrowLeftCircle,
    FiArrowRightCircle,
} from "react-icons/fi";
import { FaList, FaRegHeart } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdAccountBox } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Link } from "react-router-dom";
import { sidebarClick } from "../../redux/utility/actions";
import { logoutThunk } from "../../redux/user/actions";
import { push } from "connected-react-router";

export function Sidebar() {
    const sidebarCollapse = useSelector(
        (state: RootState) => state.utility.sidebarCollapse
    );

    const dispatch = useDispatch();

    const sidebarOnClickHandler = () => {
        dispatch(sidebarClick(sidebarCollapse ? false : true));
    };

    // const user = useSelector((state: RootState) => state.authState.user);
    // const userInfo = JSON.parse(JSON.stringify(user));
    // const ref = useRef(null)
    return (
        <div className="sidebar">
            <ProSidebar collapsed={sidebarCollapse} width="220px">
                <SidebarHeader>
                    {/* <h3 className="sidebar_username pt-3">{userInfo.username}</h3> */}
                    <div
                        className="close_menu pb-3"
                        onClick={sidebarOnClickHandler}
                    >
                        {sidebarCollapse ? (
                            <FiArrowRightCircle />
                        ) : (
                            <FiArrowLeftCircle />
                        )}
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="square">
                        <SubMenu title="拍賣資訊" icon={<FaList />}>
                            <MenuItem>
                                我的直播拍賣
                                <Link to="/profilePage/my-live" />
                            </MenuItem>
                            <MenuItem>
                                我的拍賣商品
                                <Link to="/profilePage/my-live-products" />
                            </MenuItem>
                        </SubMenu>
                        <MenuItem icon={<AiOutlineShoppingCart />}>
                            已投得商品
                            <Link to="/profilePage/my-bid-history" />
                        </MenuItem>
                        <SubMenu title="訂閱" icon={<FaRegHeart />}>
                            <MenuItem>
                                <Link to="/profilePage/following">
                                    訂閱的人
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link to="/profilePage/follower">我的粉絲</Link>
                            </MenuItem>
                        </SubMenu>
                        <MenuItem icon={<MdAccountBox />}>
                            帳戶資料
                            <Link to="/profilePage/accountDetails" />
                        </MenuItem>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu iconShape="square">
                        <MenuItem icon={<FiLogOut />}>
                            <Link
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(logoutThunk());
                                    dispatch(push("/"));
                                }}
                                className="nav_link"
                            >
                                登出
                            </Link>
                        </MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
}
