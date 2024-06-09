// for diagnostic purposes

import {getSession} from "@/app/actions/authActions";
import Heading from "@/app/components/Heading";
import AuthTest from "@/app/session/AuthTest";

export default async function SessionPage() {
    const session = await getSession();
    
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
        </div>
    );
}