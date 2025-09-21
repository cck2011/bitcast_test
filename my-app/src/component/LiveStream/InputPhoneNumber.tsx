import React from "react";
import { Link } from "react-router-dom";

function InputPhoneNumber() {
    return (
        <div className="livestreamEdit rounded my-3 d-flex flex-column justify-content-around align-items-center">
            <div className="message">請先設定電話號碼及其他資料再進行拍賣</div>
            <div className="w-25 d-flex flex-row justify-content-around">
                <Link to="/profilePage/accountDetails">
                    <button className="btn btn-primary">設定</button>
                </Link>
            </div>
        </div>
    );
}

export default InputPhoneNumber;
