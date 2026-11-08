import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FirebaseError } from "firebase/app";
import {
    GoogleAuthProvider,
    linkWithCredential,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";
import {
    createUserWithEmailAndPassword,
    initializeUI,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithProvider,
} from "@firebase-oss/ui-core";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SignIn from "../../components/signIn/SignIn";

jest.mock("../../lib/firebase", () => ({ __esModule: true, default: {}, auth: {} }));
jest.mock("../../assets/pics/logo.svg", () => "ledger.svg");
jest.mock("@firebase-oss/ui-core/brands/google/logo.svg", () => "google.svg");
jest.mock("firebase/auth", () => ({
    GoogleAuthProvider: Object.assign(jest.fn(), { credentialFromError: jest.fn() }),
    linkWithCredential: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signInWithPopup: jest.fn(),
}));
jest.mock("@firebase-oss/ui-core", () => ({
    createUserWithEmailAndPassword: jest.fn(),
    initializeUI: jest.fn(() => ({ get: () => ({}) })),
    sendPasswordResetEmail: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithProvider: jest.fn(),
}));
jest.mock("../../service/helper/notificationHelper", () => ({
    useNotification: () => ({ addNotification: jest.fn() }),
}));

test("recovers a Google conflict on the existing ledger account before redirecting", async () => {
    const config = jest.mocked(initializeUI).mock.calls[0][0];
    const strategy = config.behaviors.find((behavior) => behavior?.providerSignInStrategy)
        .providerSignInStrategy.handler;
    jest.mocked(signInWithProvider).mockImplementation(strategy);

    const account = { email: "existing@example.com", uid: "existing-ledger" };
    const credential = { providerId: "google.com" };
    jest.mocked(GoogleAuthProvider.credentialFromError).mockReturnValue(credential as never);
    jest.mocked(signInWithPopup).mockRejectedValue(
        new FirebaseError("auth/account-exists-with-different-credential", "Conflict", {
            email: account.email,
        })
    );
    jest.mocked(onAuthStateChanged).mockReturnValue(jest.fn());
    jest.mocked(signInWithEmailAndPassword).mockImplementation(async () => {
        const listener = jest.mocked(onAuthStateChanged).mock.calls[0][1] as (
            user: unknown
        ) => void;
        listener(account);
        return { user: account } as never;
    });

    let completeLink: () => void;
    jest.mocked(linkWithCredential).mockReturnValue(
        new Promise((resolve) => {
            completeLink = () => resolve({ user: account } as never);
        })
    );

    render(
        <MemoryRouter initialEntries={["/signIn"]}>
            <Routes>
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/" element={<h1>Ledger</h1>} />
            </Routes>
        </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "other@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in with Google" }));

    const email = await screen.findByDisplayValue(account.email);
    expect(email).toHaveAttribute("readonly");
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(linkWithCredential).toHaveBeenCalledWith(account, credential));
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, account.email, "test-password");
    expect(screen.queryByRole("heading", { name: "Ledger" })).toBeNull();

    await act(async () => completeLink());
    expect(await screen.findByRole("heading", { name: "Ledger" })).toBeVisible();
});

test("creates an account with only an email and password", async () => {
    render(
        <MemoryRouter>
            <SignIn />
        </MemoryRouter>
    );

    const createAccount = screen.getByRole("link", { name: "Create account" });
    expect(createAccount).toHaveAttribute("href", "/?mode=sign-up");
    fireEvent.click(createAccount);
    expect(screen.queryByLabelText("Name", { exact: true })).toBeNull();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            {},
            "new@example.com",
            "test-password"
        );
        expect(screen.getByRole("button", { name: "Create account" })).toBeEnabled();
    });
});

test("opens password reset from a link and carries over the email", () => {
    render(
        <MemoryRouter initialEntries={["/signIn"]}>
            <SignIn />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    const forgotPassword = screen.getByRole("link", { name: "Forgot password?" });
    expect(forgotPassword).toHaveAttribute("href", "/signIn?mode=reset");
    fireEvent.click(forgotPassword);
    expect(screen.getByRole("heading", { name: "Reset password" })).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveValue("user@example.com");
    expect(screen.getByLabelText("Email")).toHaveFocus();

    const backToSignIn = screen.getByRole("link", { name: "Back to sign in" });
    backToSignIn.focus();
    fireEvent.click(backToSignIn);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Sign in" })).toBeNull();
    expect(screen.getByLabelText("Email")).toHaveFocus();
});

test("confirms the submitted reset email when the field changes during the request", async () => {
    let completeReset: () => void;
    jest.mocked(sendPasswordResetEmail).mockReturnValue(
        new Promise((resolve) => {
            completeReset = resolve;
        })
    );

    render(
        <MemoryRouter initialEntries={["/signIn?mode=reset"]}>
            <SignIn />
        </MemoryRouter>
    );
    const email = screen.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "submitted@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    fireEvent.change(email, { target: { value: "edited@example.com" } });

    await act(async () => completeReset());
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, "submitted@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent(
        "If an account exists for submitted@example.com, you’ll receive a password reset link."
    );
    expect(email).toHaveValue("edited@example.com");
});
