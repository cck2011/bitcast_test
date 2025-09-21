import React from "react";
import { CToast, CToastBody, CToastClose } from "@coreui/react";

function ErrorCannotStartCountdown() {
    return (
        <CToast
            autohide={true}
            visible={true}
            className="align-items-center mw-100"
        >
            <div className="d-flex text-danger">
                <CToastBody>倒數時間不能少於60秒或多於300秒</CToastBody>
                <CToastClose className="me-2 m-auto" />
            </div>
        </CToast>
    );
}
export default ErrorCannotStartCountdown;
