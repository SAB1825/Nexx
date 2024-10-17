import "server-only";


import { AUTH_COOKIE } from "@/features/auth/constant";
import { createMiddleware } from "hono/factory";
import {
    Client,
    Account,
    Storage,
    Models,
    Databases,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType,
    type Users as UsersType
} from 'node-appwrite';
import { getCookie } from 'hono/cookie';

type ExtraContext = {
    Variables: {
        account: AccountType,
        database: DatabasesType,
        storage: StorageType,
        users: UsersType,
        user : Models.User<Models.Preferences>
    }
}

export const sessionMiddleware = createMiddleware<ExtraContext>(
    async (c, next) => {
        const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

        const session = getCookie(c, AUTH_COOKIE);

        if(!session) {
            return c.json({ success: false, message: "Unauthorized" }, 401)
        }

        client.setSession(session);

        const account = new Account(client);
        const database = new Databases(client);
        const storage = new Storage(client);
        const users = await account.get();

        c.set("account", account);
        c.set("database", database);
        c.set("storage", storage);
        c.set("user", users);

        await next();
    }
)




