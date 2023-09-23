import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { Text } from "@radix-ui/themes";
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
                <MonthYear>
                    <Text size="4">No data</Text>
                </MonthYear>
            ) : (
                props.monthYearList.map((x) => (
                    <SwiperSlide key={x}>
                        <MonthYear key={x}>
                            <Text size="6">{dayjs(x).format("MMMM YYYY")}</Text>
                        </MonthYear>
                    </SwiperSlide>
                ))
            )}
        </Swiper>
    );
};

export default MonthYearSwiper;
