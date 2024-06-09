export {default} from "next-auth/middleware";

// export configuration to be automatically picked up by next-auth middleware
export const config = {
    // list of routes to be intercepted and protected
    matcher: [
        "/session"
    ],
    // override the built-in login page
    pages: {
        signIn: "/api/auth/signin",
    }
}