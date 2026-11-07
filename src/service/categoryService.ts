import { log } from "../common/utils";
import client from "../lib/apollo";
import { getErrorCode } from "./helper/errorHelper";
import { fetchAllPages, MAX_PAGE_SIZE } from "./helper/pagingHelper";
import Category from "./model/Category";
import { graphql } from "./model/gql";
import {
    CreateCategoryRequest,
    DeleteCategoryRequest,
    PatchCategoryRequest,
} from "./model/Requests";
import {
    CreateCategoryResponse,
    DeleteCategoryResponse,
    PatchCategoryResponse,
} from "./model/Responses/index";

export const categoryFragment = graphql(`
    fragment PlainCategory on Category {
        id
        name
        type
    }
`);

const CREATE_CATEGORY = graphql(`
    mutation CreateCategory($name: String!, $type: CategoryType = ANY) {
        createCategory(name: $name, type: $type) {
            ...PlainCategory
        }
    }
`);

const PATCH_CATEGORY = graphql(`
    mutation PatchCategory($id: ID!, $name: String, $type: CategoryType) {
        patchCategory(id: $id, name: $name, type: $type) {
            ...PlainCategory
        }
    }
`);

const DELETE_CATEGORY = graphql(`
    mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id)
    }
`);

const GET_CATEGORIES_PAGE = graphql(`
    query GetCategoriesPage($first: Int!, $after: String) {
        categories(first: $first, after: $after, sort: [{ property: "name", direction: ASC }]) {
            edges {
                node {
                    ...PlainCategory
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`);

/** Every category, sorted by name. Throws on failure. */
export async function fetchAllCategories(): Promise<Category[]> {
    const nodes = await fetchAllPages(async (after) => {
        const response = await client.query({
            query: GET_CATEGORIES_PAGE,
            variables: { first: MAX_PAGE_SIZE, after },
            fetchPolicy: "network-only",
        });

        if (response.error) {
            throw response.error;
        }

        return response.data.categories;
    });

    return nodes.map((c) => ({ id: c.id, name: c.name, type: c.type }));
}

export async function getAllCategories(): Promise<Category[]> {
    try {
        return await fetchAllCategories();
    } catch (err) {
        log("cannot get all categories", err);

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

        if (response.error) {
            log("cannot add category", response.error);

            return {
                addedCategory: null,
                errorCode: getErrorCode(response.error),
            };
        }

        const { id, name, type } = response.data.createCategory;

        return {
            addedCategory: { id, name, type },
        };
    } catch (err) {
        log("cannot add category, unexpected error", err);
        return {
            addedCategory: null,
            errorCode: getErrorCode(err),
        };
    }
}

export async function patchCategory(request: PatchCategoryRequest): Promise<PatchCategoryResponse> {
    try {
        const response = await client.mutate({
            mutation: PATCH_CATEGORY,
            variables: {
                id: request.id,
                name: request.name,
                type: request.type,
            },
        });

        if (response.error) {
            log("cannot update category", response.error);

            return {
                category: null,
                errorCode: getErrorCode(response.error),
            };
        }

        const { id, name, type } = response.data.patchCategory;

        return {
            category: { id, name, type },
        };
    } catch (err) {
        log("cannot update category, unexpected error", err);

        return {
            category: null,
            errorCode: getErrorCode(err),
        };
    }
}

/** Deletes the category; its transactions move to "Other". */
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
                errorCode: getErrorCode(response.error),
            };
        }

        return {
            isSuccess: true,
        };
    } catch (err) {
        log("cannot remove category, unexpected error", err);

        return {
            isSuccess: false,
            errorCode: getErrorCode(err),
        };
    }
}
