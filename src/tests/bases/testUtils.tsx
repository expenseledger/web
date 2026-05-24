import { Theme } from "@radix-ui/themes";
import { render, RenderOptions } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";

export function renderWithProviders(
    ui: React.ReactElement,
    options?: RenderOptions & { store?: ReturnType<typeof createStore> }
) {
    const store = options?.store ?? createStore();

    return {
        store,
        ...render(
            <JotaiProvider store={store}>
                <Theme>{ui}</Theme>
            </JotaiProvider>,
            options
        ),
    };
}
