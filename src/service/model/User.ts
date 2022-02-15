import Account from "./Account";
import Category from "./Category";

interface User {
    categories: Category[];
    accounts: Account[];
}

export default User;
