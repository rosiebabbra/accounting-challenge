import { render, screen } from "@testing-library/react"
import BalanceSheet from "../src/components/BalanceSheet"
import { beforeEach, test, vi, expect } from "vitest"
import React from "react"

beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                assets: {
                    current: 0,
                    fixed: 0,
                    total: 1000000,
                },
                liabilities: {
                    short_term: 0,
                    long_term: 0,
                    total: 1000000
                },
                equity: {
                    retained_earnings: 0,
                    total: 0
                },
                balanced: true,
            }),
        })
    ) as any
})

test("renders Total Assets", async () => {
    render(<BalanceSheet />)

    const totalAssets = await screen.findByText("Total Assets")
    expect(totalAssets).toBeInTheDocument()
})
