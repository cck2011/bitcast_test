import { Button, Card, Container, Image } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SvgBorder } from "./SvgBorder";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getComingAuctions } from "../../redux/homepage/action";
import { useEffect, useState } from "react";
import { ProductDetails } from "./ProductDetails";
import { fetchBroadcastingProducts } from "../../redux/broadcastingProducts/actions";
import {
    fetchSellerSubscribe,
    fetchUserProfileCardInfo,
} from "../../redux/user/actions";
import { ProfileDetails } from "./ProfileDetails";
import "./Incoming-auction.scss";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        slidesToSlide: 2, // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
    },
};

interface ComingAuctionProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loadState: number;
    setLoadState: React.Dispatch<React.SetStateAction<number>>;
}

export function ComingAuction(props: ComingAuctionProps) {
    const auctions = useSelector((state: RootState) =>
        Object.values(state.comingAuction.comingAuctions)
    );
    const token = localStorage.getItem("token");

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.loadState === 0) {
            dispatch(getComingAuctions(props.setIsLoading, props.setLoadState));
        }
    }, [dispatch, props]);

    const [modalShowProf, setModalShowProf] = useState(-1);
    const [modalShow, setModalShow] = useState(-1);

    useEffect(() => {
        dispatch(fetchBroadcastingProducts());
    }, [dispatch]);

    async function profilePreview(info: any) {
        // console.log("click");
        if (token == null) {
            return;
        } else {
            for (let auction of auctions) {
                if (auction.id === info) {
                    // console.log("auction", auction);
                    // console.log("auction", auction.username);
                    // console.log("auction", auction.user_id);
                    await dispatch(
                        fetchUserProfileCardInfo([auction.user_id], "following")
                    );
                    dispatch(fetchSellerSubscribe(auction.user_id));
                    setModalShowProf(auction.user_id);
                }
            }
        }
    }
    const [now, setNow] = useState<string>(new Date().toString());
    const [timerId, setTimerId] = useState<number>(0);
    useEffect(() => {
        setTimerId(
            window.setInterval(() => {
                setNow(new Date().toString());
            }, 16)
        );
    }, []);
    useEffect(() => {
        return () => {
            clearInterval(timerId);
        };
    }, [timerId]);

    return (
        <div>
            <Container>
                <h4 className="Incoming_auction">最新拍賣</h4>
                <SvgBorder />
                <Carousel
                    additionalTransfrom={0}
                    autoPlay
                    arrows={false}
                    autoPlaySpeed={5000}
                    centerMode={false}
                    className=""
                    containerClass="container-with-dots"
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={90}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={responsive}
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                >
                    {auctions.map((auction) => (
                        <Card key={auction.id} className="product_card">
                            <Image
                                className="img_fluid"
                                src={`${process.env.REACT_APP_BACKEND_URL}/${auction.image}`}
                                fluid
                            />
                            <Card.Body>
                                {Date.parse(auction.starting_time.toString()) -
                                    Date.parse(now) >
                                0 ? (
                                    <div className="counter">
                                        <div className="countdown_time">
                                            <div className="time_value">
                                                {Math.floor(
                                                    (Date.parse(
                                                        auction.starting_time.toString()
                                                    ) -
                                                        Date.parse(now)) /
                                                        (24 * 60 * 60 * 1000)
                                                )}
                                            </div>
                                            <div className="time_label">日</div>
                                        </div>
                                        <div className="countdown_time">
                                            <div className="time_value">
                                                {(
                                                    "0" +
                                                    (
                                                        Math.floor(
                                                            (Date.parse(
                                                                auction.starting_time.toString()
                                                            ) -
                                                                Date.parse(
                                                                    now
                                                                )) /
                                                                (60 * 60 * 1000)
                                                        ) % 24
                                                    ).toString()
                                                ).slice(-2)}
                                            </div>
                                            <div className="time_label">時</div>
                                        </div>
                                        <div className="countdown_time">
                                            <div className="time_value">
                                                {(
                                                    "0" +
                                                    (
                                                        Math.floor(
                                                            (Date.parse(
                                                                auction.starting_time.toString()
                                                            ) -
                                                                Date.parse(
                                                                    now
                                                                )) /
                                                                (60 * 1000)
                                                        ) % 60
                                                    ).toString()
                                                ).slice(-2)}
                                            </div>
                                            <div className="time_label">分</div>
                                        </div>
                                        <div className="countdown_time">
                                            <div className="time_value">
                                                {(
                                                    "0" +
                                                    (
                                                        Math.floor(
                                                            (Date.parse(
                                                                auction.starting_time.toString()
                                                            ) -
                                                                Date.parse(
                                                                    now
                                                                )) /
                                                                1000
                                                        ) % 60
                                                    ).toString()
                                                ).slice(-2)}
                                            </div>
                                            <div className="time_label">秒</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="counter d-flex align-items-center justify-content-center">
                                        <span>直播即將開始...</span>
                                    </div>
                                )}
                                <Card.Title className="broadcasting_title">
                                    {auction.title}
                                </Card.Title>
                                <Card.Text>
                                    <span
                                        key={auction.id}
                                        onClick={() => {
                                            profilePreview(auction.id);
                                        }}
                                        // onClick={() =>
                                        //     setModalShow(broadcasting.id)
                                        // }
                                        className={"seller_name"}
                                    >
                                        <span>由</span>
                                        <span className={"card_username"}>
                                            &nbsp;{auction.username}
                                            &nbsp;
                                        </span>
                                        主辦
                                    </span>
                                </Card.Text>
                                {modalShowProf === auction.user_id && (
                                    <ProfileDetails
                                        show={auction.user_id}
                                        broadcasts={auction}
                                        id={auction.user_id}
                                        onHide={() => setModalShowProf(-1)}
                                    />
                                )}
                                <div className="bid_share_container w-75 justify-content-around">
                                    <Button
                                        key={auction.id}
                                        variant="outline-dark"
                                        className="bid_button"
                                        onClick={() => setModalShow(auction.id)}
                                    >
                                        更多資料
                                    </Button>

                                    {modalShow === auction.id && (
                                        <ProductDetails
                                            show={auction.id}
                                            lives={auctions}
                                            id={auction.id}
                                            onHide={() => setModalShow(-1)}
                                        />
                                    )}
                                    {/* {console.log(
                                        "auction.buyer_link",
                                        auction.buyer_link
                                    )} */}
                                    {/* <RWebShare
                                        data={{
                                            text: "",
                                            url: `${process.env.REACT_APP_FRONTEND_URL}/liveStreaming?room=${auction.buyer_link}`,

                                            title: "Look at this amazing live",
                                        }}
                                        onClick={() =>
                                            console.log("shared successfully!")
                                        }
                                    >
                                        <FontAwesomeIcon
                                            className="share_icon"
                                            icon={faExternalLinkAlt}
                                        />
                                    </RWebShare> */}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Carousel>
            </Container>
        </div>
    );
}
