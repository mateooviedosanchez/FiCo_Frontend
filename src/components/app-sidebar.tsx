import * as React from "react"
import {
  IconDashboard,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthProvider"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
   return (
     <Sidebar collapsible="offcanvas" {...props}>
       <SidebarHeader>
         <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton
               asChild
               className="data-[slot=sidebar-menu-button]:!p-1.5"
             >
               <a href="/">
                 <span className="text-base font-semibold">FiCo</span>
               </a>
             </SidebarMenuButton>
           </SidebarMenuItem>
         </SidebarMenu>
       </SidebarHeader>
       <SidebarContent>
         <NavMain items={data.navMain} />
       </SidebarContent>
       <SidebarFooter>
        <NavUser user={user ?? undefined} />
       </SidebarFooter>
     </Sidebar>
   )
}
