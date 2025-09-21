// import moment from "moment";
import { useEffect, useState } from "react";
import { Modal, Image, Container, Row, Col } from "react-bootstrap";
// import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../redux/homepage/action";
import { RootState } from "../../store";
import SubscribeButton from "../../component/common/subscribeButton";
import { fetchSellerSubscribe } from "../../redux/user/actions";
import { push } from "connected-react-router";

// const productResponsive = {
//     desktop: {
//         breakpoint: { max: 3000, min: 1024 },
//         items: 1,
//         slidesToSlide: 1, // optional, default to 1.
//     },
//     tablet: {
//         breakpoint: { max: 1024, min: 464 },
//         items: 1,
//         slidesToSlide: 1, // optional, default to 1.
//     },
//     mobile: {
//         breakpoint: { max: 464, min: 0 },
//         items: 1,
//         slidesToSlide: 1, // optional, default to 1.
//     },
// };
export function ProfileDetails(props: any) {
    // const products = useSelector((state: RootState) =>
    //     Object.values(state.comingAuction.productDetails)
    // );
    const userId = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.id
        ) {
            return state.authState.user?.id;
        }
    });

    const sellerFollowers = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.id
        ) {
            return state.sellerFollower;
        }
    });

    const followingDetails = useSelector(
        (state: RootState) => state.following.userDetails
    );

    const dispatch = useDispatch();

    const { broadcasts } = props;
    const [broadcastArr, setBroadcastArr] = useState([]);

    useEffect(() => {
        dispatch(fetchSellerSubscribe(broadcasts.user_id));
        // dispatch(fetchUserProfileCardInfo([broadcasts.user_id], "following"));
        dispatch(fetchProductDetails());
    }, [dispatch]);

    useEffect(() => {
        // console.log("broadcasts", broadcasts);
        setBroadcastArr(broadcastArr.concat(broadcasts));
        // console.log("broadcastArr", broadcastArr);
    }, []);

    if (!broadcasts) {
        return <div></div>;
    }

    return (
        <div>
            {broadcastArr.length === 1 && (
                <Modal
                    className={"profile_card_container"}
                    {...props}
                    size="xs"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    key={(broadcastArr[0] as any).seller_id}
                >
                    {/*!!header */}
                    <Modal.Header className={"profile_card_header"} closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {/* {(broadcastArr[0] as any).username} */}
                        </Modal.Title>
                    </Modal.Header>
                    {/*body */}
                    <Modal.Body className={"profile_card_body"}>
                        {/* <h4>Info here：</h4> */}

                        <Image
                            className={"profile_preview_pic"}
                            src={`${
                                (broadcastArr[0] as any).profile_pic.search(
                                    /(https:\/\/)|(http:\/\/)/i
                                ) < 0
                                    ? process.env.REACT_APP_BACKEND_URL +
                                      "/" +
                                      (broadcastArr[0] as any).profile_pic
                                    : (broadcastArr[0] as any).profile_pic
                            }`}
                            roundedCircle
                        />
                        <Container>
                            <Row>
                                {/*left side  */}
                                <Col xs={6} md={4}></Col>
                                <h4 className={"profile_card_username"}>
                                    {(broadcastArr[0] as any).username}
                                </h4>

                                {/*right side  */}
                                <Col xs={12} md={8}></Col>
                                <div className={"profile_card_description"}>
                                    「&nbsp;
                                    {followingDetails[0].description
                                        ? followingDetails[0].description
                                        : "此人尚未撰寫個人介紹"}
                                    &nbsp;」
                                </div>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer className={"profile_card_footer"}>
                        <div className={"followers_container"}>
                            <span className={"card_info_Num"}>
                                {sellerFollowers
                                    ? sellerFollowers.sellerId.length
                                    : 0}
                            </span>
                            {/* {(broadcastArr[0] as any).telegram_acct
                                ? (broadcastArr[0] as any).telegram_acct
                                : "此人尚未有Telegram Account"} */}
                            <span className={"card_info_item"}>粉絲</span>
                        </div>
                        <div className={"products_container"}>
                            <span className={"card_info_Num"}>
                                {sellerFollowers
                                    ? sellerFollowers.liveRecord.length
                                    : 0}
                            </span>
                            {/* {(broadcastArr[0] as any).telegram_acct
                                ? (broadcastArr[0] as any).telegram_acct
                                : "此人尚未有Telegram Account"} */}
                            <span className={"card_info_item"}>拍賣紀錄</span>
                        </div>
                        <div className={"follow_button_container"}>
                            {/* {(broadcastArr[0] as any).telegram_acct
                                ? (broadcastArr[0] as any).telegram_acct
                                : "此人尚未有Telegram Account"} */}
                            {/* <span>追蹤</span> */}
                            {(broadcastArr[0] as any).user_id === userId ? (
                                <div
                                    className={"card_himself_container"}
                                    onClick={() => {
                                        dispatch(
                                            push("/profilePage/accountDetails")
                                        );
                                    }}
                                >
                                    <span className={"card_himself"}>
                                        我的主頁
                                    </span>
                                </div>
                            ) : (
                                <SubscribeButton
                                    targetId={(broadcastArr[0] as any).user_id}
                                    userId={userId as number}
                                />
                            )}
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
