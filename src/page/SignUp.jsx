import {Link} from "react-router-dom";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {AlertCircleIcon} from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>無法註冊</AlertTitle>
                        <AlertDescription>
                            <p>註冊功能已被關閉</p>
                            <Link to="/login" className="flex items-center underline">
                                返回登入
                            </Link>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    );
}
