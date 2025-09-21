import moment from "moment";
import { useEffect, useState } from "react";
import { Card, Container, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLiveProducts } from "../../redux/myLiveProducts/action";
import { RootState } from "../../store";
import "./MyBidHistory.scss";
import "./Animation.scss";

interface MyBidHistoryProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MyBidHistory(props: MyBidHistoryProps) {
    const [loadState, setLoadState] = useState<number>(0);
    const myBidHistories = useSelector((state: RootState) =>
        Object.values(state.myLive.myLiveProducts)
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (loadState === 0) {
            props.setIsLoading(true);
        }
    }, [loadState, props]);
    useEffect(() => {
        dispatch(fetchMyLiveProducts(props.setIsLoading, setLoadState));
    }, [dispatch, props]);

    const user = useSelector((state: RootState) => state.authState.user);
    const userInfo = JSON.parse(JSON.stringify(user));

    return (
        <div className="myBidHistory ps-3">
            <Container>
                <h2 className="pt-3">成功投到的商品</h2>
            </Container>
            <Container className="my_live_container pt-3">
                <div className="row">
                    {myBidHistories.map(
                        (myBidHistory) =>
                            myBidHistory.buyer_id !== null &&
                            myBidHistory.buyer_id === userInfo.id &&
                            myBidHistory.seller_id !== userInfo.id && (
                                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <Card
                                        className="my_live_product_card_body mb-3 h-100"
                                        style={{ width: "16rem" }}
                                        key={myBidHistory.id}
                                    >
                                        <div className="card_bg_color2">
                                            <div className="card_absolute_layer d-flex justify-content-center">
                                                <Image
                                                    className="my_live_products"
                                                    src={`${
                                                        myBidHistory.product_image.search(
                                                            /(https:\/\/)|(http:\/\/)/i
                                                        ) < 0
                                                            ? process.env
                                                                  .REACT_APP_BACKEND_URL +
                                                              "/" +
                                                              myBidHistory.product_image
                                                            : myBidHistory.product_image
                                                    }`}
                                                    fluid
                                                />
                                            </div>
                                        </div>
                                        <Card.Body className="my_bid_card_container px-3">
                                            <Card.Title>
                                                產品名稱：{" "}
                                                {myBidHistory.product_name}
                                            </Card.Title>
                                            <Card.Text>
                                                拍賣日期：{" "}
                                                {moment(
                                                    myBidHistory.starting_time
                                                ).format("YYYY-MM-DD")}
                                            </Card.Text>
                                            <Card.Text>
                                                成交價格：{" "}
                                                {myBidHistory.current_price}
                                            </Card.Text>
                                            <Card.Text>
                                                賣家電郵： {myBidHistory.email}
                                            </Card.Text>
                                            <Card.Text>
                                                賣家電話：{" "}
                                                {myBidHistory.phone_number}
                                            </Card.Text>
                                            <Card.Text>
                                                賣家Telegram帳戶：{" "}
                                                {myBidHistory.telegram_acct}
                                            </Card.Text>
                                            <Card.Text>
                                                由 {myBidHistory.username} 主辦
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                    )}
                </div>
            </Container>
        </div>
    );
}
