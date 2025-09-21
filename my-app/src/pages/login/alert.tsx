
import { CToast, CToastBody, CToastClose, } from '@coreui/react';

function ToastDemo() {
    
   
  return (
      
    <CToast autohide={true} visible={true} animation={true} className="align-items-center">
  <div className="d-flex text-danger w-100">
    <CToastBody>請在個人頁面更改電話號碼</CToastBody>
    <CToastClose className="me-2 m-auto" />
  </div>
</CToast>
  )
}
export default ToastDemo;