import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {useState} from "react";
import {Label} from "@radix-ui/react-label";
import {ChevronDownIcon, LoaderCircle} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Calendar} from "@/components/ui/calendar.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {cn} from "@/lib/utils.js";
import {useLocation, useNavigate} from "react-router-dom";
import {addFood, RequireSession} from "@/src/service/SupabaseServices.jsx";

const foodTypeMapping = [
    {
        key: 'buffet',
        label: '自助餐'
    },
    {
        key: 'diner',
        label: '麵食/簡餐',
        default: true,
    }
]

export default function AddFoodPage() {
    const nav = useNavigate();
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const [user, setUser] = useState(null);
    const [date, setDate] = useState(new Date());
    const [foodType, setFoodType] = useState(foodTypeMapping.filter(it => it.default)[0].key);
    const [food, setFood] = useState();
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    function onSubmit() {
        setLoading(true);
        addFood(user, date, foodType, food, confirmed).then(({data, error}) => {
            if (error) {
                setError(error);
                setLoading(false);
            }
            else {
                if (search.has('submit')) {
                    nav(search.get('submit'));
                }
                else {
                    nav(-1);
                }
            }
        });
    }
    return (
        <RequireSession onGetUser={setUser}>
            <div className="h-full w-full items-center justify-center p-3">
                <Card>
                    <CardHeader>
                        <CardTitle>新增食物</CardTitle>
                        {/*<CardDescription></CardDescription>*/}
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-3">
                            <div className="grid grid-cols-[100px_1fr] gap-3 items-center">
                                <Label htmlFor="date">Date</Label>
                                <CalendarPicker id="date" date={date} setDate={setDate} className="w-full" />

                                <Label htmlFor="foodType">食物類型</Label>
                                <Select id="foodType" onValueChange={setFoodType} defaultValue={foodType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="選擇類型"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {foodTypeMapping.map(it =>
                                                <SelectItem key={it.key} value={it.key}>{it.label}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Label htmlFor="foodName" className="text-nowrap">食物名稱</Label>
                                <Input id="foodName" placeholder="食物名稱" className="w-full" onChange={e => setFood(e.target.value)} />

                                <div />
                                <div className="flex gap-3 items-center">
                                    <Checkbox id="confirm" onChange={e => setConfirmed(e.target.value)} />
                                    <Label htmlFor="confirm" className="w-full">已確認</Label>
                                </div>
                            </div>
                            <div>
                                {error ? (
                                    <div className="text-right text-destructive">
                                        {error}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex gap-3 justify-end">
                                <Button variant="secondary" onClick={() => {
                                    if (search.has('back')) {
                                        nav(search.get('back'));
                                    }
                                    else {
                                        nav(-1);
                                    }
                                }}>取消</Button>
                                <Button onClick={onSubmit} disabled={loading}>
                                    {loading ? <>
                                            <LoaderCircle className="animate-spin" />
                                            儲存中...
                                        </> : '送出' }
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </RequireSession>
    )
}

export function CalendarPicker(
{
    date, setDate, className, id = 'date', name = 'date', placeholder = '選擇日期'
}) {
    const [open, setOpen] = useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" id={id} name={name}
                        className={cn("w-48 justify-between font-normal", className)}>
                    {date ? date.toLocaleDateString() : placeholder}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        setDate(date)
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

