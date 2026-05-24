import { screen } from "@testing-library/react";
import MonthYearSwiper from "../../components/bases/MonthYearSwiper";
import { renderWithProviders } from "./testUtils";

jest.mock("swiper/react", () => ({
    Swiper: ({
        children,
        onSlideChange,
    }: {
        children: React.ReactNode;
        onSlideChange?: (swiper: { activeIndex: number }) => void;
    }) => (
        <div
            data-testid="swiper"
            onClick={() => onSlideChange?.({ activeIndex: 0 })}
            onKeyDown={() => undefined}
            role="presentation">
            {children}
        </div>
    ),
    SwiperSlide: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="swiper-slide">{children}</div>
    ),
}));

jest.mock("swiper/modules", () => ({
    Navigation: {},
}));

describe("MonthYearSwiper", () => {
    it("shows no data message when list is empty", () => {
        renderWithProviders(
            <MonthYearSwiper monthYearList={[]} onSlideChange={jest.fn()} />
        );

        expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("renders formatted month year slides", () => {
        renderWithProviders(
            <MonthYearSwiper
                monthYearList={["2024-06-01", "2024-05-01"]}
                onSlideChange={jest.fn()}
            />
        );

        expect(screen.getByText("June 2024")).toBeInTheDocument();
        expect(screen.getByText("May 2024")).toBeInTheDocument();
    });

    it("calls onSlideChange when swiper is interacted with", () => {
        const onSlideChange = jest.fn();

        const { getByTestId } = renderWithProviders(
            <MonthYearSwiper monthYearList={["2024-06-01"]} onSlideChange={onSlideChange} />
        );

        getByTestId("swiper").click();

        expect(onSlideChange).toHaveBeenCalledWith({ activeIndex: 0 });
    });
});
