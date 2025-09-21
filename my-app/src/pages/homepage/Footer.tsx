import { Button, Container, OverlayTrigger, Popover } from "react-bootstrap";
import bidcast_logo from "./bidcast_logo.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";
import { checkCurrentUser, logoutThunk } from "../../redux/user/actions";
import { push } from "connected-react-router";

export function Footer() {
    const dispatch = useDispatch();
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );

    useEffect(() => {
        dispatch(checkCurrentUser());
    }, [dispatch]);

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">請先登入</Popover.Header>
        </Popover>
    );
    return (
        <footer>
            <Container>
                <div className="logo_and_getStarted">
                    <img
                        alt="bidcast_logo"
                        src={bidcast_logo}
                        height="30"
                        className="d-inline-block align-top"
                    />
                    <div>
                        <span className="get_started">想成為拍賣主？</span>
                        {isAuthenticate ? (
                            <Link to="/createBids" className="nav_link">
                                <Button
                                    variant="success"
                                    className="get_started_button"
                                >
                                    按這裏
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/loginPage" className="nav_link">
                                <Button
                                    variant="success"
                                    className="get_started_button"
                                >
                                    按這裏
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="footer_links">
                    <Link
                        to="/searchResult?SearchingKeywords="
                        className="nav_link"
                    >
                        更多商品
                    </Link>
                    {!isAuthenticate ? (
                        <OverlayTrigger
                            trigger="click"
                            placement="bottom"
                            overlay={popover}
                            rootClose
                        >
                            <Link to="#" className="nav_link">
                                舉辦拍賣
                            </Link>
                        </OverlayTrigger>
                    ) : (
                        <Link to="/createBids" className="nav_link">
                            舉辦拍賣
                        </Link>
                    )}
                    {!isAuthenticate ? (
                        <Link to="/loginPage" className="nav_link">
                            登入 ／ 註冊
                        </Link>
                    ) : (
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
                    )}
                </div>
                <span className="copyright">
                    Copyright © 2021 Bidcast All Rights Reserved.
                </span>
            </Container>
        </footer>
    );
}
