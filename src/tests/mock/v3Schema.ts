/// <reference types="node" />
import { readFileSync } from "fs";
import { resolve } from "path";

/** The API v3 schema copied into the repo root. */
export const v3Sdl = readFileSync(resolve(__dirname, "../../../schema.graphql"), "utf8");
