import { gql } from "@apollo/client";
import { log } from "../common/utils";
import client from "../lib/apollo";
import { CategoryType } from "./constants";
import Category from "./model/Category";
import { CreateCategoryRequest, DeleteCategoryRequest } from "./model/Requests";
import { UpdateCategoryRequest } from "./model/Requests/index";
import {
    CreateCategoryResponse,
    DeleteCategoryResponse,
    UpdateCategoryResponse,
} from "./model/Responses/index";

const CREATE_CATEGORY = gql`
    mutation CreateCategory($name: String!, $type: CategoryType!) {
        createCategoryV2(input: { name: $name, type: $type }) {
            category {
                id
                name
                type
            }
        }
    }
`;

const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: Int!) {
        deleteCategory(input: { id: $id }) {
            owner {
                categories {
                    nodes {
                        id
                        name
                        type
                    }
                }
            }
        }
    }
`;
const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($id: Int!, $name: String!, $type: CategoryType!) {
        updateCategory(input: { id: $id, name: $name, type: $type }) {
            category {
                id
                name
                type
            }
        }
    }
`;

const GET_ALL_CATEGORIES = gql`
    query GetAllCategories {
        categories {
            nodes {
                id
                name
                type
            }
        }
    }
`;

export const categoryFragment = gql`
    fragment PlainCategory on Category {
        id
        name
        type
    }
`;

export async function getAllCategories(): Promise<Category[]> {
    try {
        const response = await client.query({
            query: GET_ALL_CATEGORIES,
        });

        if (response.errors) {
            log("cannot get all categories", response.errors);

            return [];
        }

        const toReturn = response.data.categories.nodes as Category[];

        return toReturn;
    } catch (err) {
        log("cannot get all categories, unexpected error", err);

        return [];
    }
}

export async function createCategory(
    request: CreateCategoryRequest
): Promise<CreateCategoryResponse> {
    try {
        const response = await client.mutate({
            mutation: CREATE_CATEGORY,
            variables: {
                name: request.name,
                type: request.type,
            },
        });

        if (response.errors) {
            log("cannot add category", response.errors);

            return {
                addedCategory: null,
            };
        }

        return {
            addedCategory: response.data.createCategoryV2.category,
        };
    } catch (err) {
        log("cannot add category, unexpected error", err);
        return {
            addedCategory: null,
        };
    }
}

export async function deleteCategory(
    request: DeleteCategoryRequest
): Promise<DeleteCategoryResponse> {
    try {
        const response = await client.mutate({
            mutation: DELETE_CATEGORY,
            variables: {
                id: request.id,
            },
        });

        if (response.errors) {
            log("cannot remove category", response.errors);

            return {
                isSuccess: false,
            };
        }

        return {
            isSuccess: true,
        };
    } catch (err) {
        log("cannot remove category, unexpected error", err);

        return {
            isSuccess: false,
        };
    }
}

export async function updateCategory(
    request: UpdateCategoryRequest
): Promise<UpdateCategoryResponse> {
    try {
        const response = await client.mutate({
            mutation: UPDATE_CATEGORY,
            variables: {
                id: request.id,
                name: request.name,
                type: request.type,
            },
        });

        if (response.errors) {
            log("Cannot update category", response.errors);

            return {
                updatedCategory: null,
            };
        }

        return {
            updatedCategory: {
                id: response.data.updateCategory.category.id,
                name: response.data.updateCategory.category.name,
                type: response.data.updateCategory.category.type as CategoryType,
            },
        };
    } catch (err) {
        log("cannot update category, unexpected error", err);

        return {
            updatedCategory: null,
        };
    }
}
