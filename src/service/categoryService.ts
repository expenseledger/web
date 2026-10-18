import { log } from "../common/utils";
import client from "../lib/apollo";
import Category from "./model/Category";
import { graphql } from "./model/gql";
import { CreateCategoryRequest, DeleteCategoryRequest } from "./model/Requests";
import { CreateCategoryResponse, DeleteCategoryResponse } from "./model/Responses/index";

// v2 requires a type; ANY shows the category in every transaction form.
const CREATE_CATEGORY = graphql(`
    mutation CreateCategory($name: String!) {
        createCategoryV2(input: { name: $name, type: ANY }) {
            category {
                id
                name
            }
        }
    }
`);

const DELETE_CATEGORY = graphql(`
    mutation DeleteCategory($id: Int!) {
        deleteCategory(input: { id: $id }) {
            owner {
                categories {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
    }
`);

const GET_ALL_CATEGORIES = graphql(`
    query GetAllCategories {
        categories {
            nodes {
                id
                name
            }
        }
    }
`);

export const categoryFragment = graphql(`
    fragment PlainCategory on Category {
        id
        name
    }
`);

export async function getAllCategories(): Promise<Category[]> {
    try {
        const response = await client.query({
            query: GET_ALL_CATEGORIES,
        });

        if (response.error) {
            log("cannot get all categories", response.error);

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
            },
        });

        if (response.error) {
            log("cannot add category", response.error);

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

        if (response.error) {
            log("cannot remove category", response.error);

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
