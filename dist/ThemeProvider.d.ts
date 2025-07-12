import React from 'react';
import { ThemeContextValue, ThemeProviderProps } from './types';
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
export declare const useTheme: () => ThemeContextValue;
export declare const withTheme: <P extends object>(Component: React.ComponentType<P>) => React.ComponentType<P>;
export default ThemeProvider;
//# sourceMappingURL=ThemeProvider.d.ts.map