import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SidebarStateHandler = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Set localStorage to false when navigating to /dashboard
        if (pathname === "/dashboard") {
            localStorage.setItem("isSidebarOpen", "false");
        }
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default SidebarStateHandler;