import { gql } from "@apollo/client";
import axios from "axios";
import Category from "./model/Category";
import { CreateCategoryRequest, DeleteCategoryRequest } from "./model/Requests";
import {
    AddCategoryResponse,
    RemoveCategoryResponse,
} from "./model/Responses/index";
import { callAxios, isReturnSuccessStatus, log } from "./Utils";

const categoryUrl = (path: string) =>
    process.env.REACT_APP_SERVER_URL + "/category" + path;

export async function getAllCategories(): Promise<Category[]> {
    let toReturn: Category[] = new Array(0);
    const response = await callAxios(axios.post, categoryUrl("/list"));

    if (!isReturnSuccessStatus(response)) {
        return toReturn;
    }

    if (response.data) {
        toReturn = response.data.items;
    }

    return toReturn;
}

export async function initCategory(): Promise<void> {
    const response = await callAxios(axios.post, categoryUrl("/init"));

    if (!isReturnSuccessStatus(response)) {
        log(`Cannot init category, ${response.error?.message}`);
        throw new Error("Cannot init category");
    }
}

export async function createCategory(
    request: CreateCategoryRequest
): Promise<AddCategoryResponse> {
    const response = await callAxios(
        axios.post,
        categoryUrl("/create"),
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(`Cannot add category, ${response.error?.message}`);

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}

export async function deleteCategory(
    request: DeleteCategoryRequest
): Promise<RemoveCategoryResponse> {
    const response = await callAxios(
        axios.post,
        categoryUrl("/delete"),
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(`Cannot remove category, ${response.error?.message}`);

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}

export const ADD_CATEGORY = gql`
    mutation AddCategory($name: String!) {
        createCategory(input: { name: $name }) {
            category {
                id
                name
            }
        }
    }
`;
