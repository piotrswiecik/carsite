import EmptyFilter from "@/app/components/EmptyFilter";

// overrides the built-in login page
// extract callbackUrl param from query string to redirect user back to the page they were on
export default function SignInPage({searchParams}: {searchParams: { callbackUrl: string}}) {
    return (
        <EmptyFilter
            title="You need to be logged in to do that!"
            subtitle="Click below to sign in"
            showLogin
            callbackUrl={searchParams.callbackUrl}
        />
    );
}