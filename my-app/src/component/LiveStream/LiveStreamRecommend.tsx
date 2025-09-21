import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeDummy } from "../../redux/LiveStream/actions";
import { RootState } from "../../store";
import { Recommend } from "../../redux/LiveStream/actions";

interface LiveStreamRecommendProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function LiveStreamRecommend(props: LiveStreamRecommendProps) {
    const dispatch = useDispatch();

    const recommendList = useSelector(
        (state: RootState) => state.liveStream.recommendList.results
    );

    const recommendListCopy = [...recommendList];
    let len = recommendListCopy.length;
    const recommendation: Recommend[] = [];
    for (let ind = 0; ind < Math.min(10, len); ind++) {
        recommendation.push(
            recommendListCopy.splice(
                Math.floor(Math.random() * recommendListCopy.length),
                1
            )[0]
        );
    }

    return (
        <div className="LiveStreamRecommend my-3">
            {recommendation.map((item, ind) => (
                <div
                    className="recommendAuction m-3 d-flex flex-row justify-content-between align-items-start"
                    key={ind}
                    onClick={() => {
                        window.history.pushState(
                            null,
                            "",
                            `${process.env.REACT_APP_FRONTEND_URL}/liveStreaming?room=${item.buyer_link}`
                        );
                        dispatch(changeDummy());
                        props.setIsLoading(true);
                    }}
                >
                    <img
                        className="thumbnail mb-3"
                        src={`${process.env.REACT_APP_BACKEND_URL}/${item.image}`}
                        alt="recommendAuction"
                    />
                    <div className="info d-flex flex-column h-100 justify-content-between">
                        <div className="title text-start ms-3 mt-3">
                            {item.title}
                        </div>
                        <div className="username text-start ms-3 mt-3">
                            {item.username}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LiveStreamRecommend;
