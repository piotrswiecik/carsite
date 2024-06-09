// for diagnostic purposes

import {getSession, getTokenWorkaround} from "@/app/actions/authActions";
import Heading from "@/app/components/Heading";
import AuthTest from "@/app/session/AuthTest";

export default async function SessionPage() {
    const session = await getSession();
    const token = await getTokenWorkaround();
    
    return (
        <div>
            <Heading title="Session dashboard" subtitle="Powered by NextAuth.js" />
            <div className="bg-blue-200 border-2 border-blue-500">
                <h3 className="text-lg">Session data</h3>
                <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
            <div className="mt-4">
                <AuthTest />
            </div>
            <div className="mt-4 bg-green-200 border-2 border-green-500">
                <h3 className="text-lg">Token data</h3>
                <pre className="overflow-auto">{JSON.stringify(token, null, 2)}</pre>
            </div>
        </div>
    );
}