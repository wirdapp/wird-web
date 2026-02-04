import { ReactComponent as WirdLogo } from "assets/icons/Shared/wirdLogo.svg";
import { useTranslation } from "react-i18next";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { ContestSwitcher } from "./contest-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { i18n } = useTranslation();

	return (
		<Sidebar
			collapsible="icon"
			side={i18n.dir() === "rtl" ? "right" : "left"}
			{...props}
		>
			<SidebarHeader>
				<div className="flex justify-center py-2">
					<WirdLogo className="h-10 w-10 shrink-0" />
				</div>
				<ContestSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
