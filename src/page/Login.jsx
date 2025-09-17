import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import {signInWithEmail} from "../service/SupabaseServices.jsx";
import { Loader2Icon } from "lucide-react"

export default function LoginPage() {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const nav = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(search.has('no-session') ? '未登入或登入效期已過' : null)
    function onSubmit() {
        setLoading(true);
        setError(null);
        signInWithEmail(email, password)
            .then(({data, err}) => {
                if (err) {
                    setError(`${err.status}: ${err.code}`)
                }
                else {
                    const redirect = search.get('redirect');
                    const newUrl = redirect || '/'
                    nav(newUrl);
                }
            });
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>登入 <span style={{"color": "#006cb7"}}>Everlight</span> Lunch</CardTitle>
                            <CardDescription>
                                請使用 Email 登入
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="m@example.com" required onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">密碼</Label>
                                            <Link to="/forgot-password"
                                                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                                忘記密碼？
                                            </Link>
                                        </div>
                                        <Input id="password" type="password" required onChange={e => setPassword(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" disabled={loading} className="w-full" onClick={onSubmit}>
                                            {loading ? <Loader2Icon className="animate-spin" /> : null}
                                            登入{loading ? "中..." : null}
                                        </Button>
                                        {error ? <p className="text-destructive">{error}</p> : null}
                                    </div>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    沒有帳號嗎？{" "}
                                    <Link to="/signup" className="underline underline-offset-4">
                                        註冊
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
