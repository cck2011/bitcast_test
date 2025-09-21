import { useEffect, useState } from "react";
import { Accordion, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchSoldProducts } from "../../redux/myLiveProducts/action";
import { RootState } from "../../store";
import { MyLiveProducts } from "../../redux/myLiveProducts/action";
import "./Animation.scss";
import "./MyLiveProducts.scss";

interface MyLiveProductsProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MyLiveProductsComponent(props: MyLiveProductsProps) {
    const [loadState, setLoadState] = useState<number>(0);
    const myLiveProducts = useSelector((state: RootState) =>
        Object.values(state.myLive.myLiveProducts)
    );
    let myLiveProductsSorted: MyLiveProducts[] = myLiveProducts.sort(
        (item1, item2) => item2.live_id - item1.live_id
    );
    let myLiveProductsArr: MyLiveProducts[][] = [];
    let ind = 0;

    while (ind < myLiveProductsSorted.length) {
        if (myLiveProductsArr.length === 0) {
            myLiveProductsArr.push([]);
            if (myLiveProductsSorted[ind] !== undefined) {
                myLiveProductsArr[0].push(myLiveProductsSorted[ind]);
                ind++;
            }
        } else {
            if (
                myLiveProductsArr[myLiveProductsArr.length - 1][0].id &&
                myLiveProductsSorted[ind].live_id ===
                    myLiveProductsArr[myLiveProductsArr.length - 1][0].live_id
            ) {
                myLiveProductsArr[myLiveProductsArr.length - 1].push(
                    myLiveProductsSorted[ind]
                );
                ind++;
            } else {
                myLiveProductsArr.push([]);
                myLiveProductsArr[myLiveProductsArr.length - 1].push(
                    myLiveProductsSorted[ind]
                );
                ind++;
            }
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (loadState === 0) {
            props.setIsLoading(true);
        }
    }, [loadState, props]);

    useEffect(() => {
        dispatch(fetchSoldProducts(props.setIsLoading, setLoadState));
    }, [dispatch, props]);

    const user = useSelector((state: RootState) => state.authState.user);
    const userInfo = JSON.parse(JSON.stringify(user));

    return (
        <div className="myLiveProducts ps-3">
            <Container>
                <h2 className="pt-3">我拍賣的商品</h2>
            </Container>
            <Container className="my_live_products_container pt-3">
                <Accordion defaultActiveKey="0" flush>
                    {myLiveProductsArr.map(
                        (myLiveProductArr, index) =>
                            myLiveProductArr[0].seller_id === userInfo.id && (
                                <Accordion.Item
                                    eventKey={`${index}`}
                                    key={index}
                                >
                                    <Accordion.Header>
                                        直播名稱： {myLiveProductArr[0].title}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Table responsive="md">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>商品名稱</th>
                                                    <th>成交價</th>
                                                    <th>買家</th>
                                                    <th>買家電郵</th>
                                                    <th>買家電話</th>
                                                    <th>買家TG帳號</th>
                                                </tr>
                                            </thead>
                                            {myLiveProductArr.map(
                                                (product, index) => (
                                                    <tbody
                                                        key={
                                                            product.product_name
                                                        }
                                                    >
                                                        <tr>
                                                            <td>{`${
                                                                index + 1
                                                            }`}</td>
                                                            <td>
                                                                {
                                                                    product.product_name
                                                                }
                                                            </td>
                                                            {product.buyer_id !==
                                                                null &&
                                                                product.buyer_id !==
                                                                    product.seller_id && (
                                                                    <td>
                                                                        {
                                                                            product.current_price
                                                                        }
                                                                    </td>
                                                                )}

                                                            {product.buyer_id !==
                                                                null &&
                                                                product.buyer_id !==
                                                                    product.seller_id && (
                                                                    <td>
                                                                        {
                                                                            product.username
                                                                        }
                                                                    </td>
                                                                )}
                                                            {product.buyer_id !==
                                                                null &&
                                                                product.buyer_id !==
                                                                    product.seller_id && (
                                                                    <td>
                                                                        {
                                                                            product.email
                                                                        }
                                                                    </td>
                                                                )}
                                                            {product.buyer_id !==
                                                                null &&
                                                                product.buyer_id !==
                                                                    product.seller_id && (
                                                                    <td>
                                                                        {
                                                                            product.phone_number
                                                                        }
                                                                    </td>
                                                                )}
                                                            {product.buyer_id !==
                                                                null &&
                                                                product.buyer_id !==
                                                                    product.seller_id && (
                                                                    <td>
                                                                        {
                                                                            product.telegram_acct
                                                                        }
                                                                    </td>
                                                                )}
                                                        </tr>
                                                    </tbody>
                                                )
                                            )}
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                    )}
                </Accordion>
            </Container>
        </div>
    );
}
