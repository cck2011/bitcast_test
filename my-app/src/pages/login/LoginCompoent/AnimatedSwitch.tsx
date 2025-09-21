import React, { useEffect } from "react";
import { NavLink, Route, Switch, BrowserRouter, withRouter } from "react-router-dom";
import '../Login.scss';
import { SignupForm } from "../Form/SignupForm";
import { LoginForm } from "../Form/LoginForm";
import { useDispatch } from "react-redux"
import { SwitchTransition, CSSTransition } from 'react-transition-group';

export const AnimatedSwitch = withRouter(({ location }) => (
    <SwitchTransition>
        <CSSTransition
            key={location.key}
            classNames="my-node"
            timeout={300}
            addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
            unmountOnExit
        >
            <Switch>
                <Route exact path="/loginPage/SignupForm" component={SignupForm} />
                <Route exact path="/loginPage" component={LoginForm} />
            </Switch>
        </CSSTransition>
    </SwitchTransition>
));