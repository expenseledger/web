import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import dayjs from "../../lib/dayjs";

interface MonthYearSwiperProps {
    monthYearList: string[];
    onSlideChange: (swiper: SwiperClass) => void;
}

const MonthYear = styled.h4`
    text-align: center;
`;

const MonthYearSwiper: React.FC<MonthYearSwiperProps> = (props) => {
    return (
        <Swiper
            dir="rtl"
            spaceBetween={10}
            slidesPerView={"auto"}
            centeredSlides={true}
            navigation={true}
            onSlideChange={props.onSlideChange}>
            {props.monthYearList.length === 0 ? (
                <MonthYear className="title is-4 px-5 py-5">No data</MonthYear>
            ) : (
                props.monthYearList.map((x) => (
                    <SwiperSlide key={x}>
                        <MonthYear key={x} className="title is-4 px-5 py-5">
                            {dayjs(x).format("MMMM YYYY")}
                        </MonthYear>
                    </SwiperSlide>
                ))
            )}
        </Swiper>
    );
};

export default MonthYearSwiper;
