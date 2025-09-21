import React, { useEffect } from "react";
import { NavLink, Route, Switch, BrowserRouter, withRouter } from "react-router-dom";
import "../Login.scss"

export function FormTitle() {
    return (
        <>
            <div className="formTitle2">
                <NavLink exact to='/loginPage'
                    activeClassName="formTitleLink-active"
                    className="formTitleLink">登入</NavLink>
                or
                <NavLink exact to='/loginPage/SignupForm'
                    activeClassName="formTitleLink-active"
                    className="formTitleLink"
                >註冊
                </NavLink>
            </div>
        </>
    )
}