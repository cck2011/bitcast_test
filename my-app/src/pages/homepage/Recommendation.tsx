import { Col, Container, Row, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { SvgBorder } from "./SvgBorder";
import { fetchFilteredCategories } from "../../redux/searchResult/action";
import green from "./assets/categories_green.png";
import blue from "./assets/categories_blue.png";
import red from "./assets/categories_red.png";
import yellow from "./assets/categories_yellow.png";

export function Recommendation() {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) =>
        Object.values(state.products.categories)
    );
    return (
        <div>
            <Container>
                <h4>熱門產品</h4>
                <SvgBorder />
                <Row>
                    <Col sm={6} className="recommendation_column">
                        <div className="first_category_container">
                            <Card className="bg-light text-white recommendation_card">
                                <Card.Img src={green} alt="Card image" />
                                <Card.ImgOverlay className="info_container">
                                    <Card.Title>電腦、平板與周邊</Card.Title>
                                    <Card.Text>更多精選電玩產品</Card.Text>
                                    <Link
                                        to={`/categoryResult?category=電腦、平板與周邊`}
                                        onClick={() => {
                                            dispatch(
                                                fetchFilteredCategories(
                                                    categories
                                                        .filter(
                                                            (item) =>
                                                                item.category ===
                                                                "電腦、平板與周邊"
                                                        )
                                                        .map(
                                                            (item) => item.id
                                                        )[0]
                                                )
                                            );
                                        }}
                                    >
                                        <Card.Text className="view_more">
                                            查看更多
                                        </Card.Text>
                                    </Link>
                                </Card.ImgOverlay>
                            </Card>
                        </div>
                        <div className="second_category_container">
                            <Card className="bg-light text-white recommendation_card">
                                <Card.Img src={red} alt="Card image" />
                                <Card.ImgOverlay className="info_container">
                                    <Card.Title>居家、家具與園藝</Card.Title>
                                    <Card.Text>拍賣獨特家居產品</Card.Text>
                                    <Link
                                        to={`/categoryResult?category=居家、家具與園藝`}
                                        onClick={() => {
                                            dispatch(
                                                fetchFilteredCategories(
                                                    categories
                                                        .filter(
                                                            (item) =>
                                                                item.category ===
                                                                "居家、家具與園藝"
                                                        )
                                                        .map(
                                                            (item) => item.id
                                                        )[0]
                                                )
                                            );
                                        }}
                                    >
                                        <Card.Text className="view_more">
                                            查看更多
                                        </Card.Text>
                                    </Link>
                                </Card.ImgOverlay>
                            </Card>
                        </div>
                    </Col>
                    <Col sm={6} className="recommendation_column">
                        <div className="third_category_container">
                            <Card className="bg-light text-white recommendation_card">
                                <Card.Img src={yellow} alt="Card image" />
                                <Card.ImgOverlay className="info_container">
                                    <Card.Title>運動、戶外與休閒</Card.Title>
                                    <Card.Text>絕版波鞋，簽名波衫</Card.Text>
                                    <Link
                                        to={`/categoryResult?category=運動、戶外與休閒`}
                                        onClick={() => {
                                            dispatch(
                                                fetchFilteredCategories(
                                                    categories
                                                        .filter(
                                                            (item) =>
                                                                item.category ===
                                                                "運動、戶外與休閒"
                                                        )
                                                        .map(
                                                            (item) => item.id
                                                        )[0]
                                                )
                                            );
                                        }}
                                    >
                                        <Card.Text className="view_more">
                                            查看更多
                                        </Card.Text>
                                    </Link>
                                </Card.ImgOverlay>
                            </Card>
                        </div>
                        <div className="fourth_category_container">
                            <Card className="bg-light text-white recommendation_card">
                                <Card.Img src={blue} alt="Card image" />
                                <Card.ImgOverlay className="info_container">
                                    <Card.Title>古董、藝術與礦石</Card.Title>
                                    <Card.Text>
                                        搜羅稀世古董，奇珍異石
                                    </Card.Text>
                                    <Link
                                        to={`/categoryResult?category=古董、藝術與礦石`}
                                        onClick={() => {
                                            dispatch(
                                                fetchFilteredCategories(
                                                    categories
                                                        .filter(
                                                            (item) =>
                                                                item.category ===
                                                                "古董、藝術與礦石"
                                                        )
                                                        .map(
                                                            (item) => item.id
                                                        )[0]
                                                )
                                            );
                                        }}
                                    >
                                        <Card.Text className="view_more">
                                            查看更多
                                        </Card.Text>
                                    </Link>
                                </Card.ImgOverlay>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
