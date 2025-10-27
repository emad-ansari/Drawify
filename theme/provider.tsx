'use client'

import {useState,  useEffect, } from 'react';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function ThemeProvider ({
    children,
    ...props
}: React.ComponentProps<typeof NextThemeProvider>) {
    const [mounted, setMounted]  = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    return (
        mounted && <NextThemeProvider {...props} >{children}</NextThemeProvider>
    )
}

