import { gql } from "@apollo/client";
import client from "../lib/apollo";
import Category from "./model/Category";
import { CreateCategoryRequest, DeleteCategoryRequest } from "./model/Requests";
import {
    AddCategoryResponse,
    RemoveCategoryResponse,
} from "./model/Responses/index";
import { extractGraphQLErrors, log } from "./uils";

const CREATE_CATEGORY = gql`
    mutation CreateCategory($name: String!) {
        createCategory(input: { name: $name }) {
            category {
                id
                name
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
                    }
                }
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
            }
        }
    }
`;

export async function getAllCategories(): Promise<Category[]> {
    const response = await client.query({
        query: GET_ALL_CATEGORIES,
    });

    if (response.errors) {
        log(`Cannot get all categories`, response.errors);

        return [];
    }

    const toReturn = response.data.categories.nodes as Category[];

    return toReturn;
}

export async function createCategory(
    request: CreateCategoryRequest
): Promise<AddCategoryResponse> {
    const response = await client.mutate({
        mutation: CREATE_CATEGORY,
        variables: {
            input: {
                name: request.name,
            },
        },
    });

    if (response.errors) {
        log(`Cannot add category, ${extractGraphQLErrors(response.errors)}`);

        return {
            addedCategory: null,
        };
    }

    return {
        addedCategory: {
            id: response.data.category.id,
            name: response.data.ccategory.name,
        },
    };
}

export async function deleteCategory(
    request: DeleteCategoryRequest
): Promise<RemoveCategoryResponse> {
    const response = await client.mutate({
        mutation: DELETE_CATEGORY,
        variables: {
            input: {
                id: request.id,
            },
        },
    });

    if (response.errors) {
        log(`Cannot remove category`, response.errors);

        return {
            isSuccess: false,
        };
    }

    return {
        isSuccess: true,
    };
}