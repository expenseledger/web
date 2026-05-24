import "@testing-library/jest-dom";
import React from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// This line is important for avoiding the "ReferenceError: React is not defined" error
global.React = React;

global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};
