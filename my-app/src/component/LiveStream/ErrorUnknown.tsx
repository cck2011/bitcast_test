import React from "react";
import { CToast, CToastBody, CToastClose } from "@coreui/react";

function ErrorUnknown() {
    return (
        <CToast
            autohide={true}
            visible={true}
            className="align-items-center mw-100"
        >
            <div className="d-flex text-danger">
                <CToastBody>未知錯誤</CToastBody>
                <CToastClose className="me-2 m-auto" />
            </div>
        </CToast>
    );
}
export default ErrorUnknown;
