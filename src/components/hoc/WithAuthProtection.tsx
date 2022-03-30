import { onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { IsSignInState } from "../../common/shareState";
import { auth } from "../../lib/firebase";
import Loading from "../bases/Loading";

interface WithAuthProtectionProps {
    redirectPath?: string;
    isTest?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withAuthProtection = (WrappedComponent: any) =>
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    function WithAuthProtection(props: WithAuthProtectionProps) {
        const [isSignin, setIsSignin] = React.useState(false);
        const navigate = useNavigate();

        React.useEffect(() => {
            if (props.isTest) {
                return;
            }

            onAuthStateChanged(auth, (user) => {
                user ? setIsSignin(true) : navigate(props.redirectPath ?? "/signIn");
            });
        }, [isSignin, navigate, props.isTest, props.redirectPath]);

        return isSignin || props.isTest ? <>{WrappedComponent}</> : <Loading />;
    };

interface AuthProtectionProps {
    redirectPath?: string;
    isTest?: boolean;
}

export const AuthProtection: React.FC<AuthProtectionProps> = (props) => {
    const [isSignin, setIsSignin] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (props.isTest) {
            return;
        }

        onAuthStateChanged(auth, (user) => {
            user ? setIsSignin(true) : navigate(props.redirectPath ?? "/signIn");
        });
    }, [navigate, props.isTest, props.redirectPath]);

    return isSignin || props.isTest ? <>{props.children}</> : <Loading />;
};

export const useSignIn = (): {
    isSignIn: boolean;
    redirectToSignIn: () => void;
    isSignInLoading: boolean;
} => {
    const [isSignIn, setIsSignin] = useRecoilState(IsSignInState);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const redirectToSignIn = React.useCallback(() => {
        if (isSignIn) {
            return;
        }

        navigate("/signIn");
    }, [isSignIn, navigate]);

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setIsSignin(!!user);
            setIsLoading(false);
        });

        const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [setIsSignin]);

    return {
        isSignIn,
        redirectToSignIn,
        isSignInLoading: isLoading,
    };
};
