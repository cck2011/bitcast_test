import React from "react";
import { CToast, CToastBody, CToastClose } from "@coreui/react";

function ErrorCannotSelfBid() {
    return (
        <CToast
            autohide={true}
            visible={true}
            className="align-items-center mw-100"
        >
            <div className="d-flex text-danger">
                <CToastBody>你不能投標自己的拍賣品</CToastBody>
                <CToastClose className="me-2 m-auto" />
            </div>
        </CToast>
    );
}
export default ErrorCannotSelfBid;
