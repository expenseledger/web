import {
    createUserWithEmailAndPassword,
    FirebaseUIError,
    initializeUI,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithProvider,
    type Behavior,
} from "@firebase-oss/ui-core";
import googleLogo from "@firebase-oss/ui-core/brands/google/logo.svg";
import { Box, Button, Callout, Flex, Heading, Link, Text, TextField } from "@radix-ui/themes";
import { FirebaseError } from "firebase/app";
import {
    GoogleAuthProvider,
    linkWithCredential,
    onAuthStateChanged,
    signInWithPopup,
    type OAuthCredential,
    type User,
} from "firebase/auth";
import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/pics/logo.svg";
import app, { auth } from "../../lib/firebase";
import { useNotification } from "../../service/helper/notificationHelper";
import "./SignIn.css";

class GoogleAccountConflict extends Error {
    constructor(
        readonly email: string,
        readonly credential: OAuthCredential
    ) {
        super("Sign in with your existing password to connect Google to this account.");
    }
}

// Keep the pending credential in memory, tied to the email from the Google conflict.
const googlePopup: Behavior<"providerSignInStrategy"> = {
    providerSignInStrategy: {
        type: "callable",
        async handler(ui, provider) {
            try {
                return await signInWithPopup(ui.auth, provider);
            } catch (error) {
                if (
                    error instanceof FirebaseError &&
                    error.code === "auth/account-exists-with-different-credential"
                ) {
                    const email = error.customData?.email;
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    if (typeof email === "string" && credential) {
                        throw new GoogleAccountConflict(email, credential);
                    }
                }
                throw error;
            }
        },
    },
};

const authUI = initializeUI({ app, auth, behaviors: [googlePopup] });
const titles = { signIn: "Sign in", signUp: "Create account", reset: "Reset password" };
type Mode = keyof typeof titles;
type Action = Mode | "google";
type Feedback = { view: string; error?: string; resetEmail?: string };

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const { key: view, search } = useLocation();
    const { addNotification } = useNotification();
    const emailInput = React.useRef<HTMLInputElement>(null);
    const focusedView = React.useRef(view);
    const [email, setEmail] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [pending, setPending] = React.useState<Action | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const inFlight = React.useRef(false);
    const [feedback, setFeedback] = React.useState<Feedback | null>(null);
    const [conflict, setConflict] = React.useState<GoogleAccountConflict | null>(null);
    const [previousView, setPreviousView] = React.useState(view);

    if (previousView !== view) {
        setPreviousView(view);
        setFeedback(null);
        setShowPassword(false);
    }

    const requestedMode = new URLSearchParams(search).get("mode");
    const mode: Mode =
        requestedMode === "reset"
            ? "reset"
            : requestedMode === "sign-up" && !conflict
              ? "signUp"
              : "signIn";
    const currentFeedback = feedback?.view === view ? feedback : null;

    const busy = pending !== null;
    React.useEffect(() => {
        if (focusedView.current === view) return;
        focusedView.current = view;
        emailInput.current?.focus();
    }, [view]);
    React.useEffect(() => onAuthStateChanged(auth, setUser), []);
    React.useEffect(() => {
        if (user && !busy) navigate("/", { replace: true });
    }, [busy, navigate, user]);

    function followAuthLink(event: React.MouseEvent<HTMLAnchorElement>) {
        if (inFlight.current) {
            event.preventDefault();
            return;
        }
        if (emailInput.current) setEmail(emailInput.current.value.trim());
    }

    async function run(action: Action, authenticate: () => Promise<unknown>) {
        if (inFlight.current) return;
        inFlight.current = true;
        setPending(action);
        setFeedback(null);
        try {
            await authenticate();
        } catch (error) {
            if (error instanceof GoogleAccountConflict) {
                setConflict(error);
                setEmail(error.email);
            } else if (error instanceof FirebaseUIError) {
                if (error.code !== "auth/popup-closed-by-user") {
                    setFeedback({ view, error: error.message });
                }
            } else {
                setFeedback({ view, error: "Something went wrong. Please try again." });
            }
        } finally {
            inFlight.current = false;
            setPending(null);
        }
    }

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const address = String(data.get("email")).trim();
        const password = String(data.get("password") ?? "");
        setEmail(address);

        await run(mode, async () => {
            const ui = authUI.get();
            switch (mode) {
                case "reset":
                    try {
                        await sendPasswordResetEmail(ui, address);
                    } catch (error) {
                        if (
                            !(error instanceof FirebaseUIError) ||
                            error.code !== "auth/user-not-found"
                        ) {
                            throw error;
                        }
                    }
                    setFeedback({ view, resetEmail: address });
                    break;
                case "signUp":
                    await createUserWithEmailAndPassword(ui, address, password);
                    break;
                case "signIn": {
                    const result = await signInWithEmailAndPassword(ui, address, password);
                    if (
                        result &&
                        conflict &&
                        result.user.email?.toLowerCase() === conflict.email.toLowerCase()
                    ) {
                        try {
                            await linkWithCredential(result.user, conflict.credential);
                        } catch {
                            addNotification(
                                "Signed in, but Google could not be connected.",
                                "warning"
                            );
                        }
                    }
                    break;
                }
            }
        });
    }

    const signingUp = mode === "signUp";
    const resetting = mode === "reset";

    return (
        <Flex
            justify="center"
            align="center"
            direction="column"
            gap={{ initial: "4", xs: "5" }}
            pt={{ initial: "5", xs: "9" }}
            pb="6"
            px="6">
            <img className="sign-in-logo" src={Logo} alt="" width="144" height="166" />
            <Heading as="h1" align="center" size={{ initial: "6", xs: "8" }}>
                Welcome to Expense Ledger
            </Heading>
            <Box p={{ initial: "0", xs: "5" }} width="100%" maxWidth="26rem">
                <Flex direction="column" gap="4">
                    {mode !== "signIn" && (
                        <Heading as="h2" size="5">
                            {titles[mode]}
                        </Heading>
                    )}
                    {conflict && (
                        <Callout.Root role="status">
                            <Callout.Text>{conflict.message}</Callout.Text>
                        </Callout.Root>
                    )}
                    <form
                        key={conflict ? `${mode}-recovery` : mode}
                        method="post"
                        onSubmit={submit}>
                        <Flex direction="column" gap="4">
                            <Box>
                                <Text as="label" htmlFor="auth-email" size="2" weight="bold">
                                    Email
                                </Text>
                                <TextField.Root
                                    className="sign-in-field"
                                    ref={emailInput}
                                    id="auth-email"
                                    name="email"
                                    type="email"
                                    autoComplete={resetting ? "email" : "username"}
                                    defaultValue={conflict?.email ?? email}
                                    readOnly={!!conflict}
                                    spellCheck={false}
                                    enterKeyHint={resetting ? "done" : "next"}
                                    size="3"
                                    required
                                />
                            </Box>
                            {!resetting && (
                                <Box>
                                    <Text as="label" htmlFor="auth-password" size="2" weight="bold">
                                        Password
                                    </Text>
                                    <TextField.Root
                                        className="sign-in-field"
                                        id="auth-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete={
                                            signingUp ? "new-password" : "current-password"
                                        }
                                        enterKeyHint="done"
                                        size="3"
                                        required>
                                        <TextField.Slot side="right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="1"
                                                aria-pressed={showPassword}
                                                aria-controls="auth-password"
                                                aria-label="Show password"
                                                onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? "Hide" : "Show"}
                                            </Button>
                                        </TextField.Slot>
                                    </TextField.Root>
                                    {mode === "signIn" && (
                                        <Flex justify="end" mt="2">
                                            <Link
                                                asChild
                                                color="gray"
                                                size="2"
                                                weight="bold"
                                                underline="always">
                                                <RouterLink
                                                    to="?mode=reset"
                                                    aria-disabled={busy}
                                                    onClick={followAuthLink}>
                                                    Forgot password?
                                                </RouterLink>
                                            </Link>
                                        </Flex>
                                    )}
                                </Box>
                            )}
                            {currentFeedback?.error && (
                                <Callout.Root color="red" role="alert">
                                    <Callout.Text>{currentFeedback.error}</Callout.Text>
                                </Callout.Root>
                            )}
                            {currentFeedback?.resetEmail && (
                                <Callout.Root role="status">
                                    <Callout.Text>
                                        If an account exists for {currentFeedback.resetEmail},
                                        you’ll receive a password reset link.
                                    </Callout.Text>
                                </Callout.Root>
                            )}
                            <Button
                                type="submit"
                                size="3"
                                highContrast
                                disabled={busy}
                                loading={pending === mode}>
                                {resetting ? "Send reset link" : titles[mode]}
                            </Button>
                        </Flex>
                    </form>
                    {mode === "signIn" && !conflict && (
                        <Button
                            type="button"
                            variant="outline"
                            color="gray"
                            size="3"
                            disabled={busy}
                            loading={pending === "google"}
                            onClick={() =>
                                run("google", () =>
                                    signInWithProvider(authUI.get(), new GoogleAuthProvider())
                                )
                            }>
                            <img src={googleLogo} width={18} height={18} alt="" />
                            Sign in with Google
                        </Button>
                    )}
                    {mode === "signIn" && conflict ? (
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={busy}
                            onClick={() => {
                                setConflict(null);
                                setEmail("");
                                setFeedback(null);
                                setShowPassword(false);
                            }}>
                            Use a different account
                        </Button>
                    ) : (
                        <Flex justify="center" align="baseline" gap="2" wrap="wrap">
                            {mode === "signIn" && (
                                <Text size="2" color="gray">
                                    New to Expense Ledger?
                                </Text>
                            )}
                            <Link asChild size="2" weight="medium" underline="always">
                                <RouterLink
                                    to={{ search: mode === "signIn" ? "?mode=sign-up" : "" }}
                                    aria-disabled={busy}
                                    onClick={followAuthLink}>
                                    {mode === "signIn" ? "Create account" : "Back to sign in"}
                                </RouterLink>
                            </Link>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Flex>
    );
};

export default SignIn;
