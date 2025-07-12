import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

const DEFAULT_CONFIG = {
    defaultMode: 'system',
    storageKey: 'psr-theme',
    attribute: 'class',
    themes: {},
    disableTransitions: false,
    enableSystem: true,
    storageProvider: typeof window !== 'undefined' ? window.localStorage : {},
};
/**
 * Get system theme preference
 */
const getSystemTheme = () => {
    if (typeof window === 'undefined')
        return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
/**
 * Resolve theme mode to actual theme
 */
const resolveTheme = (mode) => {
    if (mode === 'system') {
        return getSystemTheme();
    }
    return mode;
};
/**
 * Get stored theme from localStorage
 */
const getStoredTheme = (storageKey, storageProvider) => {
    try {
        if (typeof window === 'undefined')
            return null;
        return storageProvider.getItem(storageKey) || null;
    }
    catch (error) {
        console.warn('Failed to get theme from storage:', error);
        return null;
    }
};
/**
 * Store theme in localStorage
 */
const setStoredTheme = (mode, storageKey, storageProvider) => {
    try {
        if (typeof window === 'undefined')
            return;
        storageProvider.setItem(storageKey, mode);
    }
    catch (error) {
        console.warn('Failed to store theme:', error);
    }
};
/**
 * Apply theme to document
 */
const applyTheme = (theme, attribute, disableTransitions = false) => {
    if (typeof window === 'undefined')
        return;
    const root = document.documentElement;
    // Disable transitions temporarily
    if (disableTransitions) {
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { transition: none !important; }';
        document.head.appendChild(style);
        requestAnimationFrame(() => {
            document.head.removeChild(style);
        });
    }
    // Apply theme
    if (attribute === 'class') {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }
    else {
        root.setAttribute(attribute, theme);
    }
    // Set color-scheme for better native styling
    root.style.colorScheme = theme;
};
/**
 * Create media query listener for system theme changes
 */
const createSystemThemeListener = (callback) => {
    if (typeof window === 'undefined')
        return () => { };
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
        callback(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
};
/**
 * Get next theme in cycle (light -> dark -> system -> light)
 */
const getNextTheme = (currentMode) => {
    const cycle = ['light', 'dark', 'system'];
    const currentIndex = cycle.indexOf(currentMode);
    // Handle case where currentMode is not found in cycle
    if (currentIndex === -1) {
        return 'light'; // Default fallback
    }
    const nextIndex = (currentIndex + 1) % cycle.length;
    const nextTheme = cycle[nextIndex];
    // TypeScript safety - this should never happen but satisfies strict checking
    return nextTheme || 'light';
};
/**
 * Toggle between light and dark (ignoring system)
 */
const toggleLightDark = (currentMode) => {
    const resolvedTheme = resolveTheme(currentMode);
    return resolvedTheme === 'light' ? 'dark' : 'light';
};
/**
 * Check if code is running in browser
 */
const isBrowser = typeof window !== 'undefined';
/**
 * Debounce function for performance optimization
 */
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
/**
 * Get theme CSS variables
 */
const getThemeVariables = (theme) => {
    const lightVars = {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '222.2 84% 4.9%',
        '--primary': '222.2 47.4% 11.2%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--muted': '210 40% 96%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--accent': '210 40% 96%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '214.3 31.8% 91.4%',
        '--input': '214.3 31.8% 91.4%',
        '--ring': '222.2 84% 4.9%',
        '--radius': '0.5rem',
    };
    const darkVars = {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--card': '222.2 84% 4.9%',
        '--card-foreground': '210 40% 98%',
        '--popover': '222.2 84% 4.9%',
        '--popover-foreground': '210 40% 98%',
        '--primary': '210 40% 98%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--muted': '217.2 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--input': '217.2 32.6% 17.5%',
        '--ring': '212.7 26.8% 83.9%',
        '--radius': '0.5rem',
    };
    return theme === 'dark' ? darkVars : lightVars;
};

const ThemeContext = createContext(undefined);
const ThemeProvider = ({ children, defaultMode = DEFAULT_CONFIG.defaultMode, storageKey = DEFAULT_CONFIG.storageKey, attribute = DEFAULT_CONFIG.attribute, themes = DEFAULT_CONFIG.themes, disableTransitions = DEFAULT_CONFIG.disableTransitions, enableSystem = DEFAULT_CONFIG.enableSystem, storageProvider = DEFAULT_CONFIG.storageProvider, }) => {
    const [mode, setModeState] = useState(defaultMode);
    const [systemTheme, setSystemTheme] = useState(() => isBrowser ? getSystemTheme() : 'light');
    const [isLoading, setIsLoading] = useState(true);
    // Resolve current theme
    const theme = resolveTheme(mode === 'system' ? systemTheme : mode);
    // Initialize theme on mount
    useEffect(() => {
        if (!isBrowser) {
            setIsLoading(false);
            return;
        }
        const storedTheme = getStoredTheme(storageKey, storageProvider);
        const initialMode = storedTheme || defaultMode;
        setModeState(initialMode);
        setSystemTheme(getSystemTheme());
        // Apply theme immediately to prevent flash
        const resolvedTheme = resolveTheme(initialMode === 'system' ? getSystemTheme() : initialMode);
        applyTheme(resolvedTheme, attribute, disableTransitions);
        setIsLoading(false);
    }, []);
    // Apply theme when it changes
    useEffect(() => {
        if (!isBrowser || isLoading)
            return;
        applyTheme(theme, attribute, disableTransitions);
    }, [theme, attribute, disableTransitions, isLoading]);
    // Listen for system theme changes
    useEffect(() => {
        if (!isBrowser || !enableSystem)
            return;
        const cleanup = createSystemThemeListener((newSystemTheme) => {
            setSystemTheme(newSystemTheme);
        });
        return cleanup;
    }, [enableSystem]);
    // Set theme mode
    const setMode = useCallback((newMode) => {
        setModeState(newMode);
        setStoredTheme(newMode, storageKey, storageProvider);
    }, [storageKey, storageProvider]);
    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        const newMode = toggleLightDark(mode);
        setMode(newMode);
    }, [mode, setMode]);
    const value = {
        mode,
        theme,
        setMode,
        toggleTheme,
        systemTheme,
        modes: enableSystem ? ['light', 'dark', 'system'] : ['light', 'dark'],
        isLoading,
    };
    return (jsx(ThemeContext.Provider, { value: value, children: children }));
};
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
// Higher-order component for theme integration
const withTheme = (Component) => {
    const WithThemeComponent = (props) => {
        const theme = useTheme();
        return jsx(Component, { ...props, theme: theme });
    };
    WithThemeComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
    return WithThemeComponent;
};

// Default icons (using simple SVG icons)
const SunIcon = ({ className = '' }) => (jsxs("svg", { className: className, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [jsx("circle", { cx: "12", cy: "12", r: "5" }), jsx("path", { d: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })] }));
const MoonIcon = ({ className = '' }) => (jsx("svg", { className: className, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }));
const SystemIcon = ({ className = '' }) => (jsxs("svg", { className: className, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }), jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }), jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })] }));
const defaultIcons = {
    light: jsx(SunIcon, {}),
    dark: jsx(MoonIcon, {}),
    system: jsx(SystemIcon, {}),
};
const defaultLabels = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
};
const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
};
const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800',
};
const ThemeToggle = ({ className = '', size = 'md', variant = 'default', showLabels = false, labels = defaultLabels, icons = defaultIcons, onThemeChange, }) => {
    const { mode, setMode, modes } = useTheme();
    const handleToggle = () => {
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];
        // Type assertion to ensure nextMode is treated as ThemeMode
        // This is safe because modes array contains only valid ThemeMode values
        if (nextMode) {
            setMode(nextMode);
            onThemeChange?.(nextMode);
        }
    };
    const currentIcon = icons[mode] || defaultIcons[mode];
    const currentLabel = labels[mode] || defaultLabels[mode];
    return (jsx("button", { onClick: handleToggle, className: `
        inline-flex items-center justify-center rounded-md font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `, type: "button", "aria-label": `Switch to ${modes[(modes.indexOf(mode) + 1) % modes.length]} mode`, title: `Current: ${currentLabel}. Click to cycle through themes.`, children: jsxs("span", { className: "flex items-center gap-2", children: [currentIcon, showLabels && jsx("span", { className: "hidden sm:inline", children: currentLabel })] }) }));
};
// Dropdown version of theme toggle
const ThemeToggleDropdown = ({ className = '', size = 'md', variant = 'default', labels = defaultLabels, icons = defaultIcons, onThemeChange, }) => {
    const { mode, setMode, modes } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
        setIsOpen(false);
        onThemeChange?.(selectedMode);
    };
    const currentIcon = icons[mode] || defaultIcons[mode];
    return (jsxs("div", { className: "relative", children: [jsx("button", { onClick: () => setIsOpen(!isOpen), className: `
          inline-flex items-center justify-center rounded-md font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:opacity-50 disabled:pointer-events-none
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `, type: "button", "aria-label": "Open theme selector", "aria-expanded": isOpen, children: currentIcon }), isOpen && (jsxs(Fragment, { children: [jsx("div", { className: "fixed inset-0 z-10", onClick: () => setIsOpen(false), "aria-hidden": "true" }), jsx("div", { className: "absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", children: jsx("div", { className: "py-1", children: modes.map((themeMode) => (jsxs("button", { onClick: () => handleModeSelect(themeMode), className: `
                    flex w-full items-center gap-2 px-4 py-2 text-sm text-left
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${mode === themeMode ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  `, type: "button", children: [icons[themeMode] || defaultIcons[themeMode], labels[themeMode] || defaultLabels[themeMode]] }, themeMode))) }) })] }))] }));
};
// Simple text-based theme toggle
const ThemeToggleText = ({ className = '', labels = defaultLabels, onThemeChange, }) => {
    const { mode, setMode, modes } = useTheme();
    const handleToggle = () => {
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];
        // Type assertion to ensure nextMode is treated as ThemeMode
        // This is safe because modes array contains only valid ThemeMode values
        if (nextMode) {
            setMode(nextMode);
            onThemeChange?.(nextMode);
        }
    };
    return (jsx("button", { onClick: handleToggle, className: `
        text-sm font-medium text-gray-700 dark:text-gray-300
        hover:text-gray-900 dark:hover:text-gray-100
        transition-colors
        ${className}
      `, type: "button", children: labels[mode] || defaultLabels[mode] }));
};

export { DEFAULT_CONFIG, ThemeProvider, ThemeToggle, ThemeToggleDropdown, ThemeToggleText, applyTheme, createSystemThemeListener, debounce, ThemeProvider as default, getNextTheme, getStoredTheme, getSystemTheme, getThemeVariables, isBrowser, resolveTheme, setStoredTheme, toggleLightDark, useTheme, withTheme };
//# sourceMappingURL=index.esm.js.map
