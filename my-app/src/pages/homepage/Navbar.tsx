import {
    Nav,
    Navbar,
    NavDropdown,
    Popover,
    OverlayTrigger,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homepage.scss";
import bidcast_logo from "./bidcast_logo.svg";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import React, { useEffect } from "react";
import { checkCurrentUser, logoutThunk } from "../../redux/user/actions";
import { push } from "connected-react-router";
import { FormGroup, Input } from "reactstrap";
import {
    fetchFilteredCategories,
    fetchProductSearchResult,
} from "../../redux/searchResult/action";
import { fetchCategories } from "../../redux/products/actions";
import { menuIconClick, sidebarClick } from "../../redux/utility/actions";

interface NavbarProps {
    setNavbarRef: React.Dispatch<
        React.SetStateAction<HTMLDivElement | undefined>
    >;
}

export const HomePageNavbar = (props: NavbarProps) => {
    // const [show, setShow] = useState(false);
    // const showDropdown = () => {
    //   setShow(!show);
    // };
    // const hideDropdown = () => {
    //   setShow(false);
    // };

    const dispatch = useDispatch();
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );
    const profilePic = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.profile_pic
        ) {
            return state.authState.user.profile_pic;
        }
        return "360_F_391192211_2w5pQpFV1aozYQhcIw3FqA35vuTxJKrB.jpg";
    });
    const phoneNumber = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.phone_number
        ) {
            return state.authState.user?.phone_number;
        }
        return "";
    });
    const sidebarCollapse = useSelector(
        (state: RootState) => state.utility.sidebarCollapse
    );
    const menuCollapse = useSelector(
        (state: RootState) => state.utility.menuCollapse
    );
    const isClicking = useSelector(
        (state: RootState) => state.utility.isClicking
    );
    const menuRef = useRef<HTMLDivElement>(null);
    const menuToggle = useRef<HTMLButtonElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {}, [sidebarCollapse]);

    useEffect(() => {
        dispatch(checkCurrentUser());
    }, [dispatch]);

    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        dispatch(fetchProductSearchResult(searchInput));
    }, [dispatch, searchInput]);

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="div">請先登入</Popover.Header>
        </Popover>
    );

    const categories = useSelector((state: RootState) =>
        Object.values(state.products.categories)
    );

    useEffect(() => {
        // fetch ser 拎 categories data
        dispatch(fetchCategories());
    }, [dispatch]);

    const menuIconOnclickHandler = (e: React.MouseEvent) => {
        // e.stopPropagation();
        dispatch(sidebarClick(true));
        dispatch(menuIconClick(menuCollapse ? false : true, false));
    };
    // const preventPropagation = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    // }
    const navbarOnClickHandler = () => {
        if (
            menuToggle.current?.classList[
                Array.from(menuToggle.current?.classList).indexOf("collapsed")
            ] !== "collapsed"
        ) {
            menuToggle.current?.click();
        }
    };

    const [categoryId, setCategoryId] = useState(0);

    useEffect(() => {
        dispatch(fetchFilteredCategories(categoryId));
    }, [dispatch, categoryId]);

    useEffect(() => {
        if (isClicking && menuRef.current && menuToggle.current) {
            menuToggle.current.click();
        }
    }, [isClicking]);

    useEffect(() => {
        if (divRef && divRef.current) {
            props.setNavbarRef(divRef.current);
        }
    }, [divRef, props]);
    return (
        <div ref={divRef}>
            {divRef && (
                <Navbar collapseOnSelect expand="lg" className="navbar py-0 ">
                    <Link to="/" className="nav_link ms-3 bidcast_logo_link">
                        <img
                            alt="bidcast_logo"
                            src={bidcast_logo}
                            height="40"
                            className="d-inline-block align-top bidcast_logo"
                        />
                    </Link>
                    <Navbar.Toggle
                        aria-controls="responsive-navbar-nav"
                        onClick={menuIconOnclickHandler}
                        ref={menuToggle}
                    />
                    <Navbar.Collapse
                        id="responsive-navbar-nav"
                        className=" mt-md-0 mt-3"
                        ref={menuRef}
                        // onClick={preventPropagation}
                    >
                        <Nav className="me-auto navbar_buttons">
                            <FormGroup className={"search_formgroup"}>
                                <Input
                                    type="search"
                                    name="search"
                                    id="exampleSearch"
                                    placeholder="搜尋..."
                                    onChange={(event) => {
                                        setSearchInput(event.target.value);
                                    }}
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            dispatch(
                                                push(
                                                    `/searchResult?SearchingKeywords=${searchInput}`
                                                )
                                            );
                                        }
                                    }}
                                />
                            </FormGroup>

                            <Link
                                to="/"
                                className="nav_link highlight_hover"
                                onClick={navbarOnClickHandler}
                            >
                                主頁
                            </Link>

                            {!isAuthenticate ? (
                                <OverlayTrigger
                                    trigger="click"
                                    placement="bottom"
                                    overlay={popover}
                                    rootClose
                                >
                                    <Link
                                        to="#"
                                        className="nav_link highlight_hover"
                                        onClick={navbarOnClickHandler}
                                    >
                                        舉辦拍賣
                                    </Link>
                                </OverlayTrigger>
                            ) : (
                                <Link
                                    to={
                                        phoneNumber === "" ||
                                        phoneNumber === "11111111"
                                            ? "/profilePage/accountDetails"
                                            : "/createBids"
                                    }
                                    className="nav_link highlight_hover"
                                    onClick={navbarOnClickHandler}
                                >
                                    舉辦拍賣
                                </Link>
                            )}

                            <NavDropdown
                                title="商品分類"
                                id="collasible-nav-dropdown"
                                className="dropdown highlight_hover"
                                // show={show}
                                // onMouseEnter={showDropdown}
                                // onMouseLeave={hideDropdown}
                            >
                                {categories.map((category) => (
                                    <Link
                                        to={`/categoryResult?category=${category.category}`}
                                        className="dropdown_items"
                                        key={category.id}
                                        onClick={() => {
                                            setCategoryId(category.id);
                                            navbarOnClickHandler();
                                        }}
                                    >
                                        {category.category}
                                    </Link>
                                ))}
                            </NavDropdown>
                            {!isAuthenticate ? (
                                <Link
                                    to="/loginPage"
                                    className="nav_link highlight_hover"
                                    onClick={navbarOnClickHandler}
                                >
                                    登入 ／ 註冊
                                </Link>
                            ) : (
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(logoutThunk());
                                        dispatch(push("/"));
                                        navbarOnClickHandler();
                                    }}
                                    className="nav_link highlight_hover"
                                >
                                    登出
                                </Link>
                            )}
                            <Link
                                to="/profilePage/accountDetails"
                                className="nav_link mb-md-0 mb-3 me-0 me-md-3 profile_pic"
                            >
                                {isAuthenticate && profilePic && (
                                    <img
                                        alt="profile_pic"
                                        src={`${
                                            profilePic.search(
                                                /(https:\/\/)|(http:\/\/)/i
                                            ) < 0
                                                ? process.env
                                                      .REACT_APP_BACKEND_URL +
                                                  "/" +
                                                  profilePic
                                                : profilePic
                                        }`}
                                        width="40"
                                        height="40"
                                        className="rounded-circle "
                                        onClick={navbarOnClickHandler}
                                    />
                                )}
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )}
        </div>
    );
};
