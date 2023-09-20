import React from "react";
import { Box, Text } from "@radix-ui/themes";
import "./Loading.scss";

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
            <progress className="loading-progress" />
            <Box>
                <Text weight="bold">Loading...</Text>
            </Box>
        </div>
    ) : null;
};

export default Loading;
