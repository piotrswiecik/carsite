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
    ]
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }