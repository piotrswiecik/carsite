"use client";

import {Button, Dropdown, DropdownDivider} from "flowbite-react";
import Link from "next/link";
import {User} from "next-auth";
import {HiCog, HiUser} from "react-icons/hi2";
import {AiFillCar, AiFillTrophy, AiOutlineLogout} from "react-icons/ai";
import {signOut} from "next-auth/react";

type Props = {
    user: Partial<User>;
}

export default function UserActions({user}: Props) {
    return (
        <Dropdown inline label={`Welcome ${user.name}`}>
            <Dropdown.Item icon={HiUser}>
                <Link href="/">My Auctions</Link>
            </Dropdown.Item>
            <Dropdown.Item icon={AiFillTrophy}>
                <Link href="/">Auction Won</Link>
            </Dropdown.Item>
            <Dropdown.Item icon={AiFillCar}>
                <Link href="/">Sell My Car</Link>
            </Dropdown.Item>
            <Dropdown.Item icon={HiCog}>
                <Link href="/session">Session (dev only)</Link>
            </Dropdown.Item>
            <DropdownDivider />
            <Dropdown.Item icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: "/"})}>
                Sign Out
            </Dropdown.Item>
        </Dropdown>
    );
}