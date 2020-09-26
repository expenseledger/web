import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import Slider from "./bases/Slider";
import Toast from "./bases/Toast";
import "./Layout.scss";

interface LayoutProps {
    isShowBackwardIcon?: boolean;
    linkBackwardTo?: string;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const renderBackIcon = () => {
        return !!props.isShowBackwardIcon ? (
            <div className="header__backIcon">
                <Link to="/">
                    <span className="icon">
                        <i className="fas fa-lg fa-arrow-left"></i>
                    </span>
                </Link>
            </div>
        ) : null;
    };

    return (
        <>
            <Toast position="top-right" />
            <Slider>
                <span>Test</span>
            </Slider>
            <nav className="navbar is-transparent is-mobile">
                {renderBackIcon()}
                <div className="navbar-item">
                    <a className="navbar-burger burger">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <button
                                className="header__signout button is-link is-inverted is-small"
                                onClick={() => firebase.auth().signOut()}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="container is-mobile">{props.children}</section>
            <footer className="footer">
                <div className="content has-text-centered">
                    <a href="https://www.freepik.com/vectors/banner">
                        Banner vector created by upklyak - www.freepik.com
                    </a>
                </div>
            </footer>
        </>
    );
};

export default Layout;
