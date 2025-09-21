import "./adblock.scss";
import bidcast_logo from "./icon2p.png";

export function Adblock() {
    return (
        <div className="adblock w-100 d-flex justify-content-center align-items-center flex-column my-5">
            <img
                className="w-50"
                src="https://i.imgflip.com/5ru9jw.jpg"
                alt="404"
            />
            <div className="text-center my-3">
                由於Adblock過於強大, 有可能把直播內容當成廣告截斷 <br />
                請先把Adblock關閉。
            </div>
            <img
                className="logo w-25 rounded mb-3"
                src={bidcast_logo}
                alt="logo"
            />
        </div>
    );
}

export default Adblock;
