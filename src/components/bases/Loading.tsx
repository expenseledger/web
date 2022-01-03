import React from "react";

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
            <progress className="progress is-small is-dark" max="100" />
            <span
                style={{
                    display: "inlint-block",
                    fontWeight: "bold",
                }}>
                Loading...
            </span>
        </div>
    ) : null;
};

export default Loading;
