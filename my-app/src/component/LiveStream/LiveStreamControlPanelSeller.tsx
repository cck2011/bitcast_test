import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-tiny-slider";
import { TinySliderInstance } from "tiny-slider";
import { fetchSelectedProduct } from "../../redux/LiveStream/actions";
import { RootState } from "../../store";
import { Socket } from "socket.io-client";
import LiveStreamDescription from "./LiveStreamDescription";

interface LiveStreamControlPanelProps {
    isDesktop: boolean;
    isTablet: boolean;
    ws: Socket | null;
}

function LiveStreamControlPanel(props: LiveStreamControlPanelProps) {
    //Get States
    const dispatch = useDispatch();
    const carousel = useRef<TinySliderInstance>(null);
    const liveStreamControlPanelDesktopSetting = { maxHeight: "600px" };
    const products = useSelector(
        (state: RootState) =>
            state.liveStream.liveStreamProducts.liveStreamProductsArr
    );
    const liveId = useSelector(
        (state: RootState) => state.liveStream.liveStreamInfo.id
    );
    //Get States

    //Carousel Next Page Handler
    const goNextSlide = (dir: "next" | "prev") =>
        carousel.current != null && carousel.current.goTo(dir);

    const carouselOnClickHandler = (
        slideIndex: number | null,
        info: any,
        event: React.MouseEvent<Element, MouseEvent>
    ) => {
        if (slideIndex == null) {
            return;
        }
        let ind = parseInt(
            info.slideItems.item(slideIndex).ariaLabel.split("card").join("")
        );
        let productId = -1;
        for (let i = 0; i < products.length; i++) {
            if (ind === products[i].id) {
                productId = products[i].id;
            }
        }
        if (props.ws) {
            dispatch(fetchSelectedProduct(productId, props.ws, liveId));
        }
    };
    //Carousel Next Page Handler

    return (
        <div className="LiveStreamControlPanel rounded my-4">
            <div
                className="row g-0 panel_bar"
                style={
                    props.isDesktop ? {} : liveStreamControlPanelDesktopSetting
                }
            >
                <div
                    className={`col-12 d-flex d-col carousel position-relative`}
                >
                    {products.length !== 0 ? (
                        products.length > 1 ? (
                            <Carousel
                                swipeAngle={false}
                                items={1}
                                ref={carousel}
                                controls={false}
                                nav={false}
                                onClick={carouselOnClickHandler}
                            >
                                {products.map((product, ind) => (
                                    <div
                                        key={product.id}
                                        className={`carousel_card d-flex align-items-center justify-content-between`}
                                        aria-label={`card${product.id}`}
                                    >
                                        <img
                                            key={product.id}
                                            className={`carousel_img ms-3`}
                                            src={product.productImage}
                                            alt={`pic${product.id}`}
                                        />
                                        <div className="product_info mh-100 d-flex flex-column justify-content-center align-items-start">
                                            <div className="product_name">
                                                <i className="fas fa-gift"></i>{" "}
                                                競價項目:
                                                <br />
                                                {product.productName}
                                            </div>
                                            <div className="product_price">
                                                <i className="fas fa-chart-line"></i>{" "}
                                                起標價:
                                                <br />${product.minPrice}
                                            </div>
                                        </div>
                                        <LiveStreamDescription
                                            description={
                                                product.description
                                                    ? product.description
                                                    : ""
                                            }
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <div
                                className={`carousel_card w-100 d-flex align-items-center justify-content-between`}
                                aria-label={`card${products[0].id}`}
                            >
                                <img
                                    key={products[0].id}
                                    className={`carousel_img ms-3`}
                                    src={products[0].productImage}
                                    alt={`pic${products[0].id}`}
                                />
                                <div className="product_info mh-100 d-flex flex-column justify-content-center align-items-start">
                                    <div className="product_name">
                                        <i className="fas fa-gift"></i>{" "}
                                        競價項目:
                                        <br />
                                        {products[0].productName}
                                    </div>
                                    <div className="product_price">
                                        <i className="fas fa-chart-line"></i>{" "}
                                        起標價:
                                        <br />${products[0].minPrice}
                                    </div>
                                </div>
                                <LiveStreamDescription
                                    description={
                                        products[0].description
                                            ? products[0].description
                                            : ""
                                    }
                                />
                            </div>
                        )
                    ) : (
                        <></>
                    )}
                    {products.length > 1 && (
                        <>
                            <button
                                className="btn btn-secondary carousel_btn carousel_btn_left"
                                onClick={() => goNextSlide("prev")}
                            >
                                <i className="fas fa-caret-left"></i>
                            </button>
                            <button
                                className="btn btn-secondary carousel_btn carousel_btn_right"
                                onClick={() => goNextSlide("next")}
                            >
                                <i className="fas fa-caret-right"></i>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LiveStreamControlPanel;
