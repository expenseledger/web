import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
    mutation CurrentUser {
        currentUser(input: {}) {
            owner {
                accounts(orderBy: [NAME_ASC]) {
                    nodes {
                        id
                        name
                        type
                        balance
                    }
                }
                categories(orderBy: [NAME_ASC]) {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
    }
`;

export const accountFragment = gql`
    fragment PlainAccount on Account {
        id
        name
        type
        balance
    }
`;
