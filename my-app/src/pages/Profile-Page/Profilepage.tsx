import { Sidebar } from "./Sidebar";
import "./Profilepage.scss";
import { AccountDetails } from "./AccountDetails";
import { Follower } from "./Follower";
import { Following } from "./Following";
import { Route, Switch } from "react-router-dom";
import { MyLive } from "./MyLive";
import { MyLiveProductsComponent } from "./MyLiveProducts";
import { MyBidHistory } from "./MyBidHistory";

// import { useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
interface ProfilePageProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfilePage(props: ProfilePageProps) {
    return (
        <div className="profile_page">
            <Sidebar />
            <Switch>
                <Route path="/profilePage/follower">
                    <Follower setIsLoading={props.setIsLoading} />
                </Route>
                <Route path="/profilePage/following">
                    <Following setIsLoading={props.setIsLoading} />
                </Route>
                <Route path="/profilePage/accountDetails">
                    <AccountDetails />
                </Route>
                <Route path="/profilePage/my-live-products">
                    <MyLiveProductsComponent
                        setIsLoading={props.setIsLoading}
                    />
                </Route>
                <Route path="/profilePage/my-live">
                    <MyLive />
                </Route>
                <Route path="/profilePage/my-bid-history">
                    <MyBidHistory setIsLoading={props.setIsLoading} />
                </Route>
            </Switch>
        </div>
    );
}
