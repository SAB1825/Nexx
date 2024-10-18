"use server"

import { cookies } from "next/headers"
import { Account, Client } from "node-appwrite"
import { AUTH_COOKIE } from "./constant"
import { useRouter } from "next/navigation"

export const getCurrent = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        
        const session = cookies().get(AUTH_COOKIE);
        if(!session) {
            console.log("No session cookie found")
            return null
        }

        // Set the session token for the client
        client.setSession(session.value);

        const account = new Account(client);
        return await account.get();
    } catch (error) {
        console.log(error)
        return null
    }
}
