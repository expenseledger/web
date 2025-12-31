import React from "react";
import { Box, Text } from "@radix-ui/themes";
import { styled } from "@linaria/react";
import { color } from "../../common/constants";
import { css } from "@linaria/core";

const loadingAnimation = css`
    @keyframes loadingAnimation {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
`;

const LoadingProgress = styled.div`
    appearance: none;
    border: none;
    height: 4px; /* Adjust the height as needed */
    width: 100%;
    background-color: transparent; /* Transparent background color for the progress bar */
    position: relative;
    overflow: hidden;
    border-radius: 8px;

    &::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #ddd; /* Gray border color for the progress bar container */
    }

    &::-webkit-progress-value {
        background-color: transparent; /* Transparent background color for the filled portion */
    }

    &::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background-color: var(
            --${color.primary}-9
        ); /* Color for the filled portion of the progress bar */
        position: absolute;
        top: 0;
        left: -100%; /* Initial position, fully left */
        animation: ${loadingAnimation} 2s linear infinite; /* Smooth left-to-right animation */
        -webkit-animation: ${loadingAnimation} 2s linear infinite; /* Add -webkit-animation for Safari */
    }
`;

const Loading: React.FC = () => {
    const [isShowLoading, setIsShowLoading] = React.useState(false);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setIsShowLoading(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    });

    return isShowLoading ? (
        <div
            style={{
                textAlign: "center",
                margin: "auto",
                width: "50%",
                position: "fixed",
                top: "50%",
                left: "25%",
            }}>
            <LoadingProgress />
            <Box>
                <Text weight="bold">Loading...</Text>
            </Box>
        </div>
    ) : null;
};

export default Loading;
