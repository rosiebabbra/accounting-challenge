import React, { useEffect, useState } from "react"

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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "/api/companies/1/reports/balance?start=2017-01-01&end=2017-12-31"
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

        fetchData()
    }, [])

    if (loading) return <p>Loading balance sheet...</p>
    if (error) return <p>Error: {error}</p>
    if (!data) return <p>No data available.</p>

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-[36px] font-bold mb-6 text-center">Balance Sheet</h1>
            <div className="flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">Assets</h2>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="py-1">Fixed Assets</td>
                                <td className="text-right">€{data.assets.fixed.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Current Assets</td>
                                <td className="text-right">€{data.assets.current.toFixed(2)}</td>
                            </tr>
                            <tr className="border-t font-bold">
                                <td className="py-1">Total Assets</td>
                                <td className="text-right">€{data.assets.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-semibold border-b pb-1 mb-2">Liabilities & Equity</h2>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="text-gray-700 font-medium">
                                <td colSpan={2} className="pt-2">Liabilities</td>
                            </tr>
                            <tr>
                                <td className="py-1">Short-Term</td>
                                <td className="text-right">€{data.liabilities.short_term.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Long-Term</td>
                                <td className="text-right">€{data.liabilities.long_term.toFixed(2)}</td>
                            </tr>
                            <tr className="font-bold">
                                <td className="py-1">Total Liabilities</td>
                                <td className="text-right">€{data.liabilities.total.toFixed(2)}</td>
                            </tr>

                            <tr className="text-gray-700 font-medium pt-4">
                                <td colSpan={2} className="pt-4">Equity</td>
                            </tr>
                            <tr>
                                <td className="py-1">Retained Earnings</td>
                                <td className="text-right">€{data.equity.retained_earnings.toFixed(2)}</td>
                            </tr>
                            <tr className="font-bold">
                                <td className="py-1">Total Equity</td>
                                <td className="text-right">€{data.equity.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-6 font-semibold text-center">
                Balanced?{" "}
                {data.balanced ? (
                    <span className="text-green-600">Yes ✅</span>
                ) : (
                    <span className="text-red-600">No ❌</span>
                )}
            </p>
        </div>
    )
}
