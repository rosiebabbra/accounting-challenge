import React, { useEffect, useState, useMemo } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { utils, writeFile } from "xlsx"
import { MdFileDownload } from "react-icons/md"

interface BalanceData {
    assets: {
        current: number
        fixed: number
        total: number
    }
    liabilities: {
        short_term: number
        long_term: number
        total: number
    }
    equity: {
        retained_earnings: number
        total: number
    }
    balanced: boolean
}

export default function BalanceSheet() {
    const [data, setData] = useState<BalanceData | null>(null)
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
                `${import.meta.env.VITE_API_URL}/api/companies/1/reports/balance?start=${start}&end=${end}`
            )
            if (!res.ok) throw new Error("Failed to fetch balance sheet")
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
            "Fixed Assets": data.assets.fixed,
            "Current Assets": data.assets.current,
            "Total Assets": data.assets.total,
            "Short-Term Liabilities": data.liabilities.short_term,
            "Long-Term Liabilities": data.liabilities.long_term,
            "Total Liabilities": data.liabilities.total,
            "Retained Earnings": data.equity.retained_earnings,
            "Total Equity": data.equity.total,
            "Balanced": data.balanced ? "Yes" : "No"
        }
        const ws = utils.json_to_sheet([flattened])
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, "Balance Sheet")
        writeFile(wb, "balance_sheet.xlsx")
    }

    const exportToCSV = () => {
        if (!data) return
        const flattened = {
            "Fixed Assets": data.assets.fixed,
            "Current Assets": data.assets.current,
            "Total Assets": data.assets.total,
            "Short-Term Liabilities": data.liabilities.short_term,
            "Long-Term Liabilities": data.liabilities.long_term,
            "Total Liabilities": data.liabilities.total,
            "Retained Earnings": data.equity.retained_earnings,
            "Total Equity": data.equity.total,
            "Balanced": data.balanced ? "Yes" : "No",
        }
        const header = Object.keys(flattened).join(",")
        const values = Object.values(flattened).join(",")
        const csv = `${header}\n${values}`

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "balance_sheet.csv")
        link.click()
    }

    const memoizedContent = useMemo(() => {
        if (!data) return null

        return (
            <div className="flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">Assets (€)</h2>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="text-left py-1">Fixed Assets</td>
                                <td className="text-right">{data.assets.fixed.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="text-left py-1">Current Assets</td>
                                <td className="text-right">{data.assets.current.toLocaleString()}</td>
                            </tr>
                            <tr className="border-t font-bold">
                                <td className="text-left py-1">Total Assets</td>
                                <td className="text-right">{data.assets.total.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">Liabilities & Equity (€)</h2>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="text-left text-gray-700 dark:text-gray-100 font-bold">
                                <td colSpan={2} className="pt-2">Liabilities</td>
                            </tr>
                            <tr>
                                <td className="text-left py-1">Short-Term</td>
                                <td className="text-right">{data.liabilities.short_term.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="text-left py-1">Long-Term</td>
                                <td className="text-right">{data.liabilities.long_term.toLocaleString()}</td>
                            </tr>
                            <tr className="font-bold">
                                <td className="text-left py-1">Total Liabilities</td>
                                <td className="text-right">{data.liabilities.total.toLocaleString()}</td>
                            </tr>

                            <tr className="text-gray-700 font-medium pt-4">
                                <td colSpan={2} className="text-left font-bold pt-4 dark:text-gray-100">Equity</td>
                            </tr>
                            <tr>
                                <td className="text-left py-1">Retained Earnings</td>
                                <td className="text-right">{data.equity.retained_earnings.toLocaleString()}</td>
                            </tr>
                            <tr className="font-bold">
                                <td className="text-left py-1">Total Equity</td>
                                <td className="text-right">{data.equity.total.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }, [data])

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-[36px] font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">Balance Sheet</h1>
            <div className="flex flex-row md:flex-col gap-4 items-center justify-between mb-6">
                <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date: Date | null) => date && setStartDate(date)} className="border px-2 py-1 rounded" />
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">End Date:</label>
                    <DatePicker selected={endDate} onChange={(date: Date | null) => date && setEndDate(date)}
                        className="border px-2 py-1 rounded" />
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {!loading && data && (
                <>
                    {memoizedContent}
                    <div className="flex justify-end gap-1 mt-4">
                        <button
                            onClick={exportToExcel}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-[15px] flex items-center gap-2"
                        >
                            <MdFileDownload />Excel
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-gray-700 text-[15px] flex items-center gap-2"
                        >
                            <MdFileDownload />CSV
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}