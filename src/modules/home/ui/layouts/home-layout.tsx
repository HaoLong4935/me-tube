import { SidebarProvider } from "@/components/ui/sidebar"
import { HomeNavbar } from "../components/homenavbar"
import { HomeSideBar } from "../components/homesidebar"
interface HomeLayoutProps {
    children: React.ReactNode
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="w-full ">
                <HomeNavbar />
                <div className="flex min-h-screen pt-[4rem]">
                    <HomeSideBar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>

    )
}



