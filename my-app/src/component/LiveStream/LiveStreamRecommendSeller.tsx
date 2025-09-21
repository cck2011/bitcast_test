import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Recommend } from "../../redux/LiveStream/actions";
import { Link } from "react-router-dom";

function LiveStreamRecommend() {
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
                <Link to={`/liveStreaming?room=${item.buyer_link}`} key={ind}>
                    <div
                        className="recommendAuction m-3 d-flex flex-row justify-content-between align-items-start"
                        key={ind}
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
                </Link>
            ))}
        </div>
    );
}

export default LiveStreamRecommend;
