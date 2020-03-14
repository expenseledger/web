import axios from "axios";
import Category from "./model/Category";
import { AddCategoryRequest } from "./model/Requests";
import { AddCategoryResponse } from "./model/Responses/index";
import { callAxios, isReturnSuccessStatus, log } from "./Utils";

const categoryUrl = process.env.REACT_APP_SERVER_URL + "/category";

export async function getAllCategories(): Promise<Category[]> {
    let toReturn: Category[] = new Array(0);
    const response = await callAxios(axios.post, categoryUrl + "/list");

    if (!isReturnSuccessStatus(response)) {
        return toReturn;
    }

    if (response.data) {
        toReturn = response.data.items;
    }

    return toReturn;
}

export async function initCategory(): Promise<void> {
    const response = await callAxios(axios.post, categoryUrl + "/init");

    if (!isReturnSuccessStatus(response)) {
        log(`Cannot init category, ${response.error?.message}`);
        throw new Error("Cannot init category");
    }
}

export async function addCategory(
    request: AddCategoryRequest
): Promise<AddCategoryResponse> {
    const response = await callAxios(
        axios.post,
        categoryUrl + "/create",
        request
    );

    if (!isReturnSuccessStatus(response)) {
        log(`Cannot add category, ${response.error?.message}`);

        return {
            isSuccess: false
        };
    }

    return {
        isSuccess: true
    };
}
