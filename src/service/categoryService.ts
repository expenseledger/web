import { gql } from "@apollo/client";
import { extractGraphQLErrors, log } from "../common/utils";
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
): Promise<CreateCategoryResponse> {
    const response = await client.mutate({
        mutation: CREATE_CATEGORY,
        variables: {
            name: request.name,
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
            id: response.data.createCategory.category.id,
            name: response.data.createCategory.category.name,
            type: "ANY",
        },
    };
}

export async function deleteCategory(
    request: DeleteCategoryRequest
): Promise<DeleteCategoryResponse> {
    const response = await client.mutate({
        mutation: DELETE_CATEGORY,
        variables: {
            id: request.id,
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

export async function updateCategory(
    request: UpdateCategoryRequest
): Promise<UpdateCategoryResponse> {
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
}
