import "./four0Four.scss";
import bidcast_logo from "./icon2p.png";

export function Four0Four() {
    return (
        <div className="four0Four w-100 d-flex justify-content-center align-items-center flex-column my-5">
            <img
                className="w-50"
                src="https://i.imgflip.com/5ru98i.jpg"
                alt="404"
            />
            <div className="text-center my-3">
                無法瀏覽這個頁面。不便之處，敬請見諒。 <br />
                請嘗試搜尋其他內容。
            </div>
            <img
                className="logo w-25 rounded mb-3"
                src={bidcast_logo}
                alt="logo"
            />
        </div>
    );
}

export default Four0Four;
