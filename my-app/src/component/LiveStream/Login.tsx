import React from "react";
import { Link } from "react-router-dom";

interface LoginProps {
    message: string;
}

function Login(props: LoginProps) {
    return (
        <div className="livestreamLogin rounded my-3 d-flex flex-column justify-content-around align-items-center">
            <div className="message">{props.message}</div>
            <div className="w-md-25 w-50 d-flex flex-row justify-content-around">
                <Link to="/loginPage">
                    <button className="btn btn-primary">登入</button>
                </Link>
                <Link to="/loginPage/SignupForm">
                    <button className="btn btn-success">註冊</button>
                </Link>
            </div>
        </div>
    );
}

export default Login;
