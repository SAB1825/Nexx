import { Loader2 } from "lucide-react";

const DashboardLoading = () => {
    return (
    <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
    </div>
)
}

export default DashboardLoading;