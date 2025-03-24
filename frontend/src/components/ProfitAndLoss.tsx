import React, { useEffect, useState, useMemo } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { utils, writeFile } from "xlsx"
import { MdFileDownload } from "react-icons/md"

interface RevenueBreakdown {
    product_sales: number
    grants: number
    total: number
}

interface ExpenseBreakdown {
    payroll: number
    maintenance: number
    taxes: number
    external_services: number
    total: number
}

interface PnLData {
    revenue: RevenueBreakdown
    expenses: ExpenseBreakdown
    profit: number
}

export default function ProfitAndLoss() {
    const [data, setData] = useState<PnLData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [startDate, setStartDate] = useState<Date>(new Date("2017-01-01"))
    const [endDate, setEndDate] = useState<Date>(new Date("2017-12-31"))

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const start = startDate.toISOString().split("T")[0]
            const end = endDate.toISOString().split("T")[0]
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/companies/1/reports/pnl?start=${start}&end=${end}`
            )
            if (!res.ok) throw new Error("Failed to fetch P&L report")
            const json = await res.json()
            setData(json)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [startDate, endDate])

    const exportToExcel = () => {
        if (!data) return
        const flattened = {
            "Product Sales": data.revenue.product_sales,
            "Grants": data.revenue.grants,
            "Total Revenue": data.revenue.total,
            "Payroll": data.expenses.payroll,
            "Maintenance": data.expenses.maintenance,
            "Taxes": data.expenses.taxes,
            "External Services": data.expenses.external_services,
            "Total Expenses": data.expenses.total,
            "Net Profit": data.profit,
        }
        const ws = utils.json_to_sheet([flattened])
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, "P&L Report")
        writeFile(wb, "profit_and_loss.xlsx")
    }

    const exportToCSV = () => {
        if (!data) return
        const flattened = {
            "Product Sales": data.revenue.product_sales,
            "Grants": data.revenue.grants,
            "Total Revenue": data.revenue.total,
            "Payroll": data.expenses.payroll,
            "Maintenance": data.expenses.maintenance,
            "Taxes": data.expenses.taxes,
            "External Services": data.expenses.external_services,
            "Total Expenses": data.expenses.total,
            "Net Profit": data.profit,
        }
        const header = Object.keys(flattened).join(",")
        const values = Object.values(flattened).join(",")
        const csv = `${header}\n${values}`

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "profit_and_loss.csv")
        link.click()
    }

    const memoizedPnL = useMemo(() => {
        if (!data) return null

        return (
            <div className="bg-gray-100 dark:bg-[#1e293b] dark:text-white rounded-lg p-4 shadow">
                <table className="w-full text-sm dark:text-gray-200">
                    <thead>
                        <tr>
                            <th className="text-left pb-2 text-gray-600 dark:text-gray-200">Category</th>
                            <th className="text-right pb-2 text-gray-600 dark:text-gray-200">Amount (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left font-bold pt-4">Revenue</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-left pl-2 py-1">Product Sales</td>
                            <td className="text-right">{data.revenue.product_sales.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left pl-2 py-1">Grants</td>
                            <td className="text-right">{data.revenue.grants.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t font-bold">
                            <td className="text-left py-1">Total Revenue</td>
                            <td className="text-right">{data.revenue.total.toLocaleString()}</td>
                        </tr>

                        <tr>
                            <td className="text-left font-bold pt-6">Expenses</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-left py-1">Payroll</td>
                            <td className="text-right">{data.expenses.payroll.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left py-1">Maintenance</td>
                            <td className="text-right">{data.expenses.maintenance.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left py-1">Taxes</td>
                            <td className="text-right">{data.expenses.taxes.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left py-1">External Services</td>
                            <td className="text-right">{data.expenses.external_services.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t font-bold">
                            <td className="text-left py-1">Total Expenses</td>
                            <td className="text-right">{data.expenses.total.toLocaleString()}</td>
                        </tr>

                        <tr className="border-t-2 font-bold text-lg">
                            <td className="text-left pt-4">Net Profit</td>
                            <td className="text-right pt-4">
                                {data.profit >= 0 ? (
                                    <span className="text-green-600 dark:text-gray-200">€{data.profit.toLocaleString()}</span>
                                ) : (
                                    <span className="text-red-600">-€{Math.abs(data.profit).toLocaleString()}</span>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }, [data])

    return (
        <div className="p-4 min-w-[50vw] max-w-screen mx-auto">
            <h1 className="text-[36px] font-bold mb-6 text-center text-gray-700 dark:text-gray-200 ">Profit and Loss</h1>
            <div className="flex flex-row max-[639px]:flex-col items-center gap-4 justify-center mb-6">
                <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date: Date | null) => date && setStartDate(date)} className="border px-2 py-1 rounded" />
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">End Date:</label>
                    <DatePicker selected={endDate} onChange={(date: Date | null) => date && setEndDate(date)} className="border px-2 py-1 rounded ml-2" />
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {!loading && data && (
                <>
                    {memoizedPnL}
                    <div className="flex justify-end gap-1 mt-4">
                        <button
                            onClick={exportToExcel}
                            className="bg-blue-600 text-[15px] text-white px-4 py-2 rounded hover:bg-blue-900 text-sm flex items-center gap-2"
                        >
                            <MdFileDownload /> Excel
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="bg-blue-800 text-[15px] text-white px-4 py-2 rounded hover:bg-blue-900 text-sm flex items-center gap-2"
                        >
                            <MdFileDownload /> CSV
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
