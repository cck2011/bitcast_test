import { Button, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";

export function SellWithBidcast() {
    const phoneNumber = useSelector((state: RootState) => {
        if (
            typeof state.authState.user !== "string" &&
            state.authState.user?.phone_number
        ) {
            return state.authState.user?.phone_number;
        }
        return "";
    });
    return (
        <div>
            <div className="start_bid_section">
                <div className="discription_container ms-3">
                    <h3 className="bid_with_bidcast">在Bidcast拍賣</h3>
                    <p>想知道你的產品最高能賣到多少錢？</p>
                    <p>立刻嘗試拍賣就知道！</p>
                    <Link
                        to={
                            phoneNumber === "" || phoneNumber === "11111111"
                                ? "/profilePage/accountDetails"
                                : "/createBids"
                        }
                        className="nav_link"
                    >
                        <Button variant="outline-dark" className="bid_button">
                            馬上拍賣
                        </Button>
                    </Link>
                </div>
                <div>
                    <Image
                        src="https://sothebys-com.brightspotcdn.com/dims4/default/2727d5f/2147483647/strip/true/crop/1420x1040+0+0/resize/710x520!/quality/90/?url=http%3A%2F%2Fsothebys-brightspot.s3.amazonaws.com%2Fdotcom%2Ff3%2Fb2%2F960d317e43a78f46b41a198ab1c9%2F21693106-sell-with-sothebys-webbanners-1420x1040-banner2.jpg"
                        fluid
                        className="rotate_image"
                    />
                </div>
            </div>
        </div>
    );
}
