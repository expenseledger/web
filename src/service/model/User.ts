import type Account from "./Account";
import type Category from "./Category";

interface User {
    categories: Category[];
    accounts: Account[];
}

export default User;
