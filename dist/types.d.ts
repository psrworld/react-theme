export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export interface ThemeConfig {
    /** Default theme mode */
    defaultMode?: ThemeMode;
    /** Storage key for persisting theme preference */
    storageKey?: string;
    /** Attribute name to set on document element */
    attribute?: string;
    /** Custom themes configuration */
    themes?: Record<string, string>;
    /** Disable transitions during theme changes */
    disableTransitions?: boolean;
    /** Enable system theme detection */
    enableSystem?: boolean;
    /** Custom storage provider */
    storageProvider?: Storage;
}
export interface ThemeContextValue {
    /** Current theme mode */
    mode: ThemeMode;
    /** Resolved theme (computed from mode) */
    theme: ResolvedTheme;
    /** Change theme mode */
    setMode: (mode: ThemeMode) => void;
    /** Toggle between light and dark */
    toggleTheme: () => void;
    /** Check if system theme is dark */
    systemTheme: ResolvedTheme;
    /** Available theme modes */
    modes: ThemeMode[];
    /** Check if theme is currently resolving */
    isLoading: boolean;
}
export interface ThemeProviderProps extends ThemeConfig {
    children: React.ReactNode;
}
export interface ThemeToggleProps {
    /** Custom className for the toggle button */
    className?: string;
    /** Size of the toggle button */
    size?: 'sm' | 'md' | 'lg';
    /** Variant of the toggle button */
    variant?: 'default' | 'outline' | 'ghost';
    /** Show labels for each mode */
    showLabels?: boolean;
    /** Custom labels for each mode */
    labels?: {
        light?: string;
        dark?: string;
        system?: string;
    };
    /** Custom icons for each mode */
    icons?: {
        light?: React.ReactNode;
        dark?: React.ReactNode;
        system?: React.ReactNode;
    };
    /** Callback when theme changes */
    onThemeChange?: (mode: ThemeMode) => void;
}
//# sourceMappingURL=types.d.ts.map