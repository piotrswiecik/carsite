import NextAuth, {NextAuthOptions} from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt", // saving user session in encrypted JWT cookie (not readable by client js)
    },
    providers: [
        DuendeIdentityServer6({
            id: "id-server", // unique id for this provider inside next-auth
            clientId: "nextApp",
            clientSecret: "secret",
            issuer: "http://localhost:5000", // this is needed for redirecting to the correct login page
            authorization: {
                params: {
                    scope: "openid profile auctionApp"  // which scopes to request from the identity server
                }
            },
            idToken: true, // if true, user info will be extracted from token instead of userinfo request
            // but server must be configured to provide this
        })
    ],
    callbacks: {
        // account, profile and user params are populated only during initial sign-in
        // on subsequent calls only token is populated
        async jwt({token, user, profile, account}) {
            console.log("JWT callback");
            console.log({token, user, profile, account});
            
            // populate next-auth client side token with username from backend api
            if (profile) {
                token.username = profile.username;
            }
            
            // populate next-auth client side token with access token jwt
            if (account) {
                token.access_token = account.access_token;
            }
            return token;
        },
        async session({session, token, user}) {
            console.log("Session callback");
            console.log({session, token, user})
            if (token) {
                session.user.username = token.username;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }