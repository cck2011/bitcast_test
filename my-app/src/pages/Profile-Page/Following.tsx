import { useDispatch, useSelector } from "react-redux";
import { Image, Card } from "react-bootstrap";
import { RootState } from "../../store";
import "./FollowingFollower.scss";
import Login from "../../component/LiveStream/Login";
import { useEffect, useState } from "react";
import { fetchSubscribe, fetchUserCardInfo } from "../../redux/user/actions";
import SubscribeButton from "../../component/common/subscribeButton";
import "./Animation.scss";

interface ProfilePageProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Following(props: ProfilePageProps) {
    const dispatch = useDispatch();
    const [loadState, setLoadState] = useState<number>(0);
    const isAuthenticate = useSelector(
        (state: RootState) => state.user.isAuthenticate
    );
    const followingList = useSelector(
        (state: RootState) => state.following.userId
    );
    const followingListLoaded = useSelector(
        (state: RootState) => state.follower.success
    );
    const followingDetails = useSelector(
        (state: RootState) => state.following.userDetails
    );
    const userId = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.id
        ) {
            return state.authState.user?.id;
        }
        return 0;
    });
    useEffect(() => {
        if (loadState === 0) {
            props.setIsLoading(true);
        }
    }, [loadState, props]);
    useEffect(() => {
        dispatch(fetchSubscribe(true));
    }, [dispatch]);
    useEffect(() => {
        if (followingList.length > 0) {
            dispatch(
                fetchUserCardInfo(
                    followingList,
                    "following",
                    props.setIsLoading,
                    setLoadState
                )
            );
        } else if (followingList.length === 0 && followingListLoaded) {
            props.setIsLoading(false);
            setLoadState((loadState) => loadState + 1);
        }
    }, [dispatch, followingList, props, followingListLoaded]);

    return (
        <div className="following w-100 me-3 mb-3">
            {!isAuthenticate ? (
                <Login message={"請先登入"} />
            ) : (
                <div className="row">
                    {followingDetails.length !== 0 &&
                        followingDetails.map((item) => (
                            <div
                                className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
                                key={item.username}
                            >
                                <Card className="card_body">
                                    <div className="card_bg_color">
                                        {item.propic !== undefined && (
                                            <div className="card_absolute_layer d-flex justify-content-center">
                                                <Image
                                                    src={`${
                                                        item.propic.search(
                                                            /(https:\/\/)|(http:\/\/)/i
                                                        ) < 0
                                                            ? process.env
                                                                  .REACT_APP_BACKEND_URL +
                                                              "/" +
                                                              item.propic
                                                            : item.propic
                                                    }`}
                                                    width="80"
                                                    height="80"
                                                    roundedCircle
                                                    className="profile_logo"
                                                    alt="propic"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{item.username}</Card.Title>
                                        {/* <Card.Text >{item.phone_number}</Card.Text> */}
                                        {/* <Card.Text>{item.email}</Card.Text> */}
                                        <Card.Text className={"name_card_vice"}>
                                            {item.telegramAcct
                                                ? `${item.telegramAcct}`
                                                : "此用戶並未登記 Telegram 帳號"}
                                        </Card.Text>
                                        <Card.Text>
                                            {item.description
                                                ? `「 ${item.description} 」`
                                                : `「 大家好~我是${item.username} 」`}
                                        </Card.Text>
                                        <SubscribeButton
                                            targetId={item.id}
                                            userId={userId}
                                        />
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    {followingDetails.length === 0 && loadState !== 0 && (
                        <div className="zero m-3">你暫時沒有訂閱的人</div>
                    )}
                </div>
            )}
        </div>
    );
}
