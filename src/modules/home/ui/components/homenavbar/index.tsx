import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { SearchInput } from "./search-input"
import { AuthButton } from "@/modules/auth/ui/components/auth-buttons"

export const HomeNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50" >
            <div className="flex items-center gap-4 w-full">
                {/* Menu and Logo */}
                <div className="flex items-center flex-shrink-0 ">
                    <SidebarTrigger />
                    <div className="p-4 flex items-center gap-1">
                        <Link href="/">
                            <Image src="/logo.svg" alt="Youtube Logo" width={32} height={32} />
                        </Link>
                        <p className="text-xl font-semibold tracking-tight">MeTube</p>
                    </div>
                </div>

                {/* Search bar */}
                <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
                    <SearchInput />
                </div>

                {/* Auth Buttons */}
                <div className="flex-shrink-0 items-center flex gap-4">
                    <AuthButton />
                </div>
            </div>
        </nav>
    )
}