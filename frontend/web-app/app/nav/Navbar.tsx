import Search from "@/app/nav/Search";
import Logo from "@/app/nav/Logo";
import {useParamsStore} from "@/hooks/useParamsStore";
import LoginButton from "@/app/nav/LoginButton";

export default function Navbar() {
    
    return (
        <header className="sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md">
            <Logo />
            <div><Search /></div>
            <div><LoginButton /></div>
        </header>
    );
}