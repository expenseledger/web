/// <reference types="node" />
import "@testing-library/jest-dom";
import React from "react";
import { TextDecoder, TextEncoder } from "util";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// This line is important for avoiding the "ReferenceError: React is not defined" error
globalThis.React = React;

globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// jsdom lacks these; react-router needs them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
