import { screen } from "@testing-library/react";
import { createStore } from "jotai";
import { toastState } from "../../common/shareState";
import Toast from "../../components/bases/Toast";
import { renderWithProviders } from "./testUtils";

describe("Toast", () => {
    it("renders notifications from toast state", () => {
        const store = createStore();
        store.set(toastState, [
            { id: "1", text: "Hello", type: "success" },
            { id: "2", text: "World", type: "info" },
        ]);

        renderWithProviders(<Toast position="top-right" />, { store });

        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByText("World")).toBeInTheDocument();
    });

    it("applies position styles to container", () => {
        const { container } = renderWithProviders(<Toast position="bottom-left" />);

        const toastContainer = container.firstElementChild as HTMLElement;
        expect(toastContainer).toBeInstanceOf(HTMLElement);

        const injectedStyles = Array.from(document.head.querySelectorAll("style"))
            .map((style) => style.textContent)
            .join("");

        expect(injectedStyles).toContain("bottom");
        expect(injectedStyles).toContain("left");
    });
});
