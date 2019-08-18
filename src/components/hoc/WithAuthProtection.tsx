import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { RouteComponentProps } from "react-router";
import Loading from "../bases/Loading";

interface WithAuthProtectionProps extends RouteComponentProps {
    test?: string;
}

interface WithAuthProtectionState {
    isSignedIn: boolean;
}

export const withAuthProtection = (redirectPath: string = "/signIn") => (
    WrappedComponent: any
) => {
    class WithAuthProtection extends React.Component<
        WithAuthProtectionProps,
        WithAuthProtectionState
    > {
        constructor(props: WithAuthProtectionProps) {
            super(props);

            this.state = {
                isSignedIn: false
            };
        }

        componentDidMount() {
            firebase
                .auth()
                .onAuthStateChanged(user =>
                    !user
                        ? this.props.history.replace(redirectPath)
                        : this.setState({ isSignedIn: true })
                );
        }

        render() {
            if (!this.state.isSignedIn) {
                return <Loading />;
            }
            return <WrappedComponent {...this.props} />;
        }
    }

    return WithAuthProtection;
};
