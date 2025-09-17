
import {useEffect, useState} from "react";
import {confirmFood, getFoodData, logout, RequireSession} from "../service/SupabaseServices.jsx"
import {AlertCircleIcon, Check, LoaderCircle, RotateCcw} from "lucide-react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useNavigate} from "react-router-dom";

const foodTypeMapping = {
    buffet: '自助餐',
    diner: '麵食/簡餐'
}

export default function DashboardPage() {
    const nav = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (data === null) {
            getFoodData().then(({data, error}) => {
                if (error) setError(error);
                else setData(data);
            })
        }
    }, [data, error]);
    function reload() {
        setData(null);
        setError(null);
    }
    function onLogout() {
        logout().then(() => {
            nav("/login");
        })
    }
    return (
        <RequireSession>
            <div className="flex flex-col w-full h-full p-4 gap-3">
                <div className="flex flex-row w-full justify-end">
                    <Button onClick={onLogout}>登出</Button>
                </div>
                <div className="flex w-full h-full items-center justify-center">
                    <div className="flex flex-col gap-3 overflow-hidden rounded-md border w-full h-full p-4">
                        <div className="flex flex-row gap-3">
                            <Button disabled={data === null || error !== null} onClick={() => nav('/add?back=/&submit=/')}>新增</Button>
                            <Button variant="secondary" size="icon" disabled={data === null} onClick={reload}>
                                <RotateCcw />
                            </Button>
                        </div>
                        <div className="grow flex justify-center">
                            {data === null ? (<LoaderCircle className="size-10 animate-spin" />) :
                                error ? (
                                    <Alert variant="destructive">
                                        <AlertCircleIcon />
                                        <AlertTitle>讀取失敗</AlertTitle>
                                        <AlertDescription>
                                            <p>從 Supabase 取得資料失敗</p>
                                        </AlertDescription>
                                    </Alert>) : <FoodTable data={data} reload={reload} />}
                        </div>
                    </div>
                </div>
            </div>
        </RequireSession>
    );
}

function FoodTable({ data = [], reload = () => {} }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const columns = [
        {
            accessorKey: "date",
            header: 'Date',
            cell: ({ row }) => <div>{row.getValue("date")}</div>,
        },
        {
            accessorKey: "type",
            header: 'Type',
            cell: ({ row }) => {
                return <div>{foodTypeMapping[row.getValue('type')]}</div>
            },
        },
        {
            accessorKey: "food",
            header: "Food",
            cell: ({ row }) => {
                return (<div>{row.getValue("food")}</div>);
            },
        },
        {
            accessorKey: "confirm",
            header: "Confirmed",
            cell: ({ row }) => {
                return (<div>{row.getValue('confirm') ?
                    "Confirmed" :
                    <Button variant="secondary" onClick={() => {
                        confirmFood(row.original.id).then(({ error}) => {
                            if (!error) reload();
                        });
                    }}>
                        <Check className="text-emerald-400" />
                        Confirm
                    </Button>
                }</div>)
            }
        }
    ]
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });
    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}


