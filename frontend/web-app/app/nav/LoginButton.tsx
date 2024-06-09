"use client";

import {Button} from "flowbite-react";
import {signIn} from "next-auth/react";

export default function LoginButton() {
    return (
        // triggers next-auth signin flow
        <Button outline onClick={() => signIn()}>
            Login
        </Button>
    );
}