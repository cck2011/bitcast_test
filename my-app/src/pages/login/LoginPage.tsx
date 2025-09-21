import React, { useEffect } from "react";
import { NavLink, Route, Switch, BrowserRouter, withRouter } from "react-router-dom";
import { ConnectedRouter, push } from 'connected-react-router';
import { history, store } from '../../store';
import { Provider } from "react-redux";
import './Login.scss';
import image1 from "./1.jpg"
import image2 from "./img2.jpg"
import image3 from "./img1.jpeg"
import { SignupForm } from "./Form/SignupForm";
import { LoginForm } from "./Form/LoginForm";
import { useDispatch } from "react-redux"
import { checkPhoneNumber, loadToken, login } from "../../redux/user/actions";
import { useState } from "react";
import axios from 'axios'
import FacebookLogin from "react-facebook-login";
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import GoogleLogin from 'react-google-login';
import { LoadingDefaultStyle } from "../loading/loading";
import { AnimatedSwitch } from "./LoginCompoent/AnimatedSwitch";
import { FormTitle } from "./LoginCompoent/formtitle"



export function LoginPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState('')


  const responseGoogle = async (response: any) => {
    // console.log(response);
    if (response.profileObj) {

      try {
        const res = await axios.post<any>(`${process.env.REACT_APP_BACKEND_URL}/login/google`, {
          name: response.profileObj.name,
          email: response.profileObj.email,
        })


        if (res.data.token != null) {
          localStorage.setItem('token', res.data.token)
          dispatch(login(res.data.token))
          dispatch(loadToken(res.data.token))
          dispatch(checkPhoneNumber())
          // dispatch(checkUserPhoneNumber())?
          // dispatch((Toasts())):

        } else {
          setError('發生未知錯誤')
        }
      } catch (e: any) {
        if (e?.response.status === 401) {
          setError('發生未知錯誤')
        } else {
          console.error(e)
          setError('發生未知錯誤')
        }
      }
    }
    return null;
  }

  const responseFacebook = async (response: any) => {

    // console.log(response)


    if (response) {
      try {

        const res = await axios.post<any>(`${process.env.REACT_APP_BACKEND_URL}/login/facebook`, {
          name: response.name,
          email: response.email,
          image: response.picture.data.url
        })
        // console.log(res.data)

        if (res.data.token != null) {
          localStorage.setItem('token', res.data.token)
          dispatch(login(res.data.token))
          dispatch(loadToken(res.data.token))
          dispatch(checkPhoneNumber())
          // dispatch(checkUserPhoneNumber())?
          // dispatch((PhoneNumberMessageBox())):


        } else {
          setError('email or password wrong')
        }
      } catch (e: any) {
        if (e?.response.status === 401) {
          setError('發生未知錯誤')
        } else {
          console.error(e)
          setError('發生未知錯誤')
        }
      }
    }
    return null;
  }

  function FbButton() {
    return <div className="flex-icon1">

      <div className="fab fa-facebook-square fa-lg rightMargin" />
      <div>Login with Facebook</div>
    </div>;
  }
  const [loadStatus, setLoadStatus] = useState("loadingShown");

  useEffect(() => {
    setTimeout(() => {
      setLoadStatus("loadingHide");
    }, 200);
  }, []);

  return (
    loadStatus === "loadingShown" ? (
      <div className={loadStatus}>
        <LoadingDefaultStyle />
      </div>
    ) : (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BrowserRouter>
            <div className="fakeapp">

              <div className="appForm">
                <FormTitle />

                <div className="formTitle">

                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID || ''}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    cssClass="fbcss"
                    icon={<FbButton />}
                    textButton=''
                  />


                  <GoogleLogin

                    clientId={process.env.REACT_APP_GOOGLE_APP_ID || ''}
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}

                  />

                  {error}
                </div>
                <AnimatedSwitch />

              </div>
            </div>

          </BrowserRouter>
        </ConnectedRouter>
      </Provider>
    )
  )
}
