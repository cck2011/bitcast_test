import React from "react";
import { CToast, CToastBody, CToastClose } from "@coreui/react";

function ErrorCannotDoubleBid() {
    return (
        <CToast
            autohide={true}
            visible={true}
            className="align-items-center mw-100"
        >
            <div className="d-flex text-danger">
                <CToastBody>你目前已經是叫價最高的觀眾</CToastBody>
                <CToastClose className="me-2 m-auto" />
            </div>
        </CToast>
    );
}
export default ErrorCannotDoubleBid;
