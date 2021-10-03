import React from "react";
import { RouteComponentProps, useHistory } from "react-router";
import firebase from "../../lib/firebase";
import Loading from "../bases/Loading";

interface WithAuthProtectionProps extends RouteComponentProps {
    isTest?: boolean;
}

interface WithAuthProtectionState {
    isSignedIn: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withAuthProtection =
    (redirectPath = "/signIn") =>
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    (
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        WrappedComponent: any
    ) => {
        class WithAuthProtection extends React.Component<
            WithAuthProtectionProps,
            WithAuthProtectionState
        > {
            constructor(props: WithAuthProtectionProps) {
                super(props);

                this.state = {
                    isSignedIn: false,
                };
            }

            componentDidMount() {
                if (this.props.isTest) {
                    return;
                }

                firebase
                    .auth()
                    .onAuthStateChanged((user) =>
                        !user
                            ? this.props.history.replace(redirectPath)
                            : this.setState({ isSignedIn: true })
                    );
            }

            render() {
                if (!this.props.isTest && !this.state.isSignedIn) {
                    return <Loading />;
                }
                return <WrappedComponent {...this.props} />;
            }
        }

        return WithAuthProtection;
    };

interface AuthProtectionProps {
    redirectPath?: string;
    isTest?: boolean;
}

export const AuthProtection: React.FC<AuthProtectionProps> = (props) => {
    const [isSignin, setIsSignin] = React.useState(false);
    const history = useHistory();

    React.useEffect(() => {
        if (props.isTest) {
            return;
        }

        firebase.auth().onAuthStateChanged((user) => {
            user ? setIsSignin(true) : history.replace(props.redirectPath ?? "/signIn");
        });
    }, [history, props.isTest, props.redirectPath]);

    return isSignin || props.isTest ? <>{props.children}</> : <Loading />;
};
