import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { toastState } from "../../../common/shareState";
import {
    mapNotificationProps,
    useNotification,
} from "../../../service/helper/notificationHelper";

jest.mock("uuid", () => ({
    v4: jest.fn(() => "generated-uuid"),
}));

describe("notificationHelper", () => {
    describe("mapNotificationProps", () => {
        it("maps props with a generated id when id is omitted", () => {
            expect(mapNotificationProps("hello", "success")).toEqual({
                text: "hello",
                type: "success",
                id: "generated-uuid",
            });
        });

        it("uses the provided id when given", () => {
            expect(mapNotificationProps("hello", "danger", "custom-id")).toEqual({
                text: "hello",
                type: "danger",
                id: "custom-id",
            });
        });
    });

    describe("useNotification", () => {
        it("adds a notification to toast state", () => {
            const store = createStore();
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <Provider store={store}>{children}</Provider>
            );

            const { result } = renderHook(() => useNotification(), { wrapper });

            act(() => {
                result.current.addNotification("Test message", "info");
            });

            expect(store.get(toastState)).toEqual([
                {
                    text: "Test message",
                    type: "info",
                    id: "generated-uuid",
                },
            ]);
        });
    });
});
