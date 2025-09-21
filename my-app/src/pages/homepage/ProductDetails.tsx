import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Modal, Image, Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../redux/homepage/action";
import { RootState } from "../../store";

const productResponsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
    },
};

export function ProductDetails(props: any) {
    const products = useSelector((state: RootState) =>
        Object.values(state.comingAuction.productDetails)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductDetails());
    }, [dispatch]);

    const { lives } = props;
    const [liveArr, setLiveArr] = useState([]);

    useEffect(() => {
        // console.log("lives", lives);
        setLiveArr(lives.filter((live: any) => live.id === props.id));
    }, []);

    if (!lives) {
        return <div></div>;
    }

    return (
        <div>
            {liveArr.length === 1 && (
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    key={(liveArr[0] as any).id}
                >
                    <Modal.Header
                        className={"product_details_header"}
                        // closeButton
                    >
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className={"product_details_live_title"}>
                                {(liveArr[0] as any).title}
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"Product_detail_body_container"}>
                        <Container>
                            <Row className={"product_Details_body"}>
                                <Col xs={12} md={4}>
                                    <Carousel
                                        additionalTransfrom={0}
                                        autoPlay={false}
                                        arrows
                                        // autoPlaySpeed={5000}
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
                                        responsive={productResponsive}
                                        showDots={false}
                                        sliderClass=""
                                        slidesToSlide={1}
                                        swipeable
                                    >
                                        {products.map(
                                            (product) =>
                                                product.live_id ===
                                                    (liveArr[0] as any).id && (
                                                    <div
                                                        className="product_details_container"
                                                        key={product.id}
                                                    >
                                                        <Image
                                                            className={
                                                                "product_details_image"
                                                            }
                                                            src={`${process.env.REACT_APP_BACKEND_URL}/${product.product_image}`}
                                                            fluid
                                                        />
                                                        <div>
                                                            {/* 商品名稱：{" "} */}
                                                            <div
                                                                className={
                                                                    "product_details_Product_name"
                                                                }
                                                            >
                                                                {
                                                                    product.product_name
                                                                }
                                                                <span
                                                                    className={
                                                                        "New_Icon_PD"
                                                                    }
                                                                >
                                                                    NEW
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={
                                                                "product_details_Product_minPrice"
                                                            }
                                                        >
                                                            起標：{" "}
                                                            <span>
                                                                {product.min_price +
                                                                    " HKD "}
                                                            </span>
                                                        </div>
                                                        {/* <p>
                                                            即買價：{" "}
                                                            {product.buy_price}
                                                        </p> */}
                                                    </div>
                                                )
                                        )}
                                    </Carousel>
                                </Col>
                                <Col xs={12} md={8}>
                                    <div className="products_info_container">
                                        <div className="products_detailed_info">
                                            <div
                                                className={
                                                    "product_detailed_Date"
                                                }
                                            >
                                                <div>拍賣時間： </div>
                                                <span>
                                                    {moment(
                                                        (liveArr[0] as any)
                                                            .starting_time
                                                    ).format(
                                                        "YYYY-MM-DD hh:mm:ss a"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="product_detailed_description">
                                                <div>拍賣簡介： </div>
                                                <span
                                                    className={
                                                        "product_detailed_description_content"
                                                    }
                                                >
                                                    {
                                                        (liveArr[0] as any)
                                                            .description
                                                    }
                                                </span>
                                            </div>

                                            <div className="product_detailed_total">
                                                <div>拍賣商品數量：</div>
                                                <span>
                                                    {
                                                        products.filter(
                                                            (product) =>
                                                                product.live_id ===
                                                                (
                                                                    liveArr[0] as any
                                                                ).id
                                                        ).length
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer className={"product_detailed_footer"}>
                        <Button
                            className={"PD_close_btn"}
                            onClick={props.onHide}
                        >
                            離開
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
