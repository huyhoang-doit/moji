import type { ThemeState } from "@/types/store"
import { create } from "zustand"
import { persist } from "zustand/middleware"


export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            isDark: false,
            toggleTheme: () =>{
                const newValue = !get().isDark
                
                if(newValue){
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
                set({ isDark: newValue })

            },
            setTheme: (isDark: boolean) => {
                set({ isDark })
                
                if(isDark){
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            },
        }),
        {
            name: "theme-storage",
            partialize: (state) => ({
                isDark: state.isDark,
            }),
        }
    )
)