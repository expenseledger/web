import * as React from "react";

const Loading = () => {
    const [isShowLoading, setIsShowLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setIsShowLoading(true);
        }, 1000);
    });

    return isShowLoading ? (
        <div style={{ textAlign: "center", margin: "auto" }}>
            <progress className="progress is-small is-dark" max="100" />
            <span
                style={{
                    display: "inlint-block",
                    margin: "auto",
                    fontWeight: "bold"
                }}
            >
                Loading...
            </span>
        </div>
    ) : null;
};

export default Loading;
