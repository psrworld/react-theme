import { ThemeMode, ResolvedTheme, ThemeConfig } from './types';
export declare const DEFAULT_CONFIG: Required<ThemeConfig>;
/**
 * Get system theme preference
 */
export declare const getSystemTheme: () => ResolvedTheme;
/**
 * Resolve theme mode to actual theme
 */
export declare const resolveTheme: (mode: ThemeMode) => ResolvedTheme;
/**
 * Get stored theme from localStorage
 */
export declare const getStoredTheme: (storageKey: string, storageProvider: Storage) => ThemeMode | null;
/**
 * Store theme in localStorage
 */
export declare const setStoredTheme: (mode: ThemeMode, storageKey: string, storageProvider: Storage) => void;
/**
 * Apply theme to document
 */
export declare const applyTheme: (theme: ResolvedTheme, attribute: string, disableTransitions?: boolean) => void;
/**
 * Create media query listener for system theme changes
 */
export declare const createSystemThemeListener: (callback: (theme: ResolvedTheme) => void) => () => void;
/**
 * Get next theme in cycle (light -> dark -> system -> light)
 */
export declare const getNextTheme: (currentMode: ThemeMode) => ThemeMode;
/**
 * Toggle between light and dark (ignoring system)
 */
export declare const toggleLightDark: (currentMode: ThemeMode) => ThemeMode;
/**
 * Check if code is running in browser
 */
export declare const isBrowser: boolean;
/**
 * Debounce function for performance optimization
 */
export declare const debounce: <T extends (...args: any[]) => void>(func: T, wait: number) => ((...args: Parameters<T>) => void);
/**
 * Get theme CSS variables
 */
export declare const getThemeVariables: (theme: ResolvedTheme) => Record<string, string>;
//# sourceMappingURL=utils.d.ts.map