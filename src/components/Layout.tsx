import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import "./Layout.scss";

interface LayoutProps {
    isShowBackwardIcon?: boolean;
    linkBackwardTo?: string;
    children: React.ReactNode;
}

function Layout(props: LayoutProps) {
    function renderBackIcon() {
        return !!props.isShowBackwardIcon ? (
            <div className="header__backIcon">
                <Link to="/">
                    <span className="icon">
                        <i className="fas fa-lg fa-arrow-left"></i>
                    </span>
                </Link>
            </div>
        ) : null;
    }

    return (
        <div className="layout">
            <div className="header">
                {renderBackIcon()}
                <button
                    className="header__signOut button is-link is-inverted is-small"
                    onClick={() => firebase.auth().signOut()}
                >
                    Sign out
                </button>
            </div>
            <div className="content">{props.children}</div>
        </div>
    );
}

export default Layout;
