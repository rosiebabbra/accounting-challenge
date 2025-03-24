import { useEffect, useState } from "react"

export default function AppWrapper({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark"
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [isDark])

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
            <div className="flex justify-end p-4">
            </div>
            {children}
        </div>
    )
}
