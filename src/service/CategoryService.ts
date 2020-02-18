import axios from "axios";
import * as Constants from "./Constants";
import Category from "./model/Category";
import * as Utils from "./Utils";

const categoryUrl = process.env.REACT_APP_SERVER_URL + "/category";

export async function getAllCategories(): Promise<Category[]> {
    let toReturn: Category[] = new Array(0);
    const response = await Utils.callAxios(axios.post, categoryUrl + "/list");

    if (response.status !== Constants.httpStatus.ok || !response.success) {
        return toReturn;
    }

    if (response.data) {
        toReturn = response.data.items;
    }

    return toReturn;
}

export async function initCategory(): Promise<void> {
    const response = await Utils.callAxios(axios.post, categoryUrl + "/init");

    if (response.status !== Constants.httpStatus.ok || !response.success) {
        throw new Error(`Cannot init category, ${response.error?.message}`);
    }
}
