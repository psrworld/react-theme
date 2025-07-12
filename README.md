# react-theme

A comprehensive React theme management library with TypeScript support for dark, light, and system modes.

## Features

- 🌙 **Dark/Light/System modes** - Support for all three theme modes
- 🎨 **Tailwind CSS integration** - Built-in support for Tailwind CSS classes
- 🔧 **TypeScript support** - Full TypeScript definitions included
- 🚀 **SSR friendly** - Works with Next.js and other SSR frameworks
- 💾 **Persistent storage** - Automatically saves theme preference
- 🎯 **Multiple toggle components** - Button, dropdown, and text variants
- 🛠️ **Customizable** - Extensive configuration options
- 🔄 **System theme detection** - Automatically detects system preference
- ⚡ **Lightweight** - Minimal bundle size with no external dependencies

## Installation

```bash
npm install react-theme
```

```bash
yarn add react-theme
```

```bash
pnpm add react-theme
```

## Quick Start

1. Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from 'react-theme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

2. Add the theme toggle component:

```tsx
import { ThemeToggle } from 'react-theme';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

3. Use the theme in your components:

```tsx
import { useTheme } from 'react-theme';

function MyComponent() {
  const { theme, mode, setMode } = useTheme();
  
  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <p>Current theme: {theme}</p>
      <p>Current mode: {mode}</p>
    </div>
  );
}
```

## Configuration

### ThemeProvider Props

```tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: 'light' | 'dark' | 'system'; // default: 'system'
  storageKey?: string; // default: 'psr-theme'
  attribute?: string; // default: 'class'
  themes?: Record<string, string>; // custom themes
  disableTransitions?: boolean; // default: false
  enableSystem?: boolean; // default: true
  storageProvider?: Storage; // default: localStorage
}
```

### Example with custom configuration:

```tsx
<ThemeProvider
  defaultMode="light"
  storageKey="my-app-theme"
  attribute="data-theme"
  disableTransitions={true}
>
  <App />
</ThemeProvider>
```

## Theme Toggle Components

### 1. ThemeToggle (Button)

```tsx
import { ThemeToggle } from 'react-theme';

<ThemeToggle
  size="md" // 'sm' | 'md' | 'lg'
  variant="default" // 'default' | 'outline' | 'ghost'
  showLabels={true}
  className="custom-class"
  onThemeChange={(mode) => console.log('Theme changed to:', mode)}
/>
```

### 2. ThemeToggleDropdown

```tsx
import { ThemeToggleDropdown } from 'react-theme';

<ThemeToggleDropdown
  size="md"
  variant="outline"
  labels={{
    light: 'Light Mode',
    dark: 'Dark Mode',
    system: 'Auto'
  }}
/>
```

### 3. ThemeToggleText

```tsx
import { ThemeToggleText } from 'react-theme';

<ThemeToggleText
  labels={{
    light: '☀️ Light',
    dark: '🌙 Dark',
    system: '💻 System'
  }}
/>
```

## useTheme Hook

```tsx
import { useTheme } from 'react-theme';

function MyComponent() {
  const {
    mode,        // Current theme mode: 'light' | 'dark' | 'system'
    theme,       // Resolved theme: 'light' | 'dark'
    setMode,     // Function to change theme mode
    toggleTheme, // Function to toggle between light/dark
    systemTheme, // System theme preference
    modes,       // Available theme modes
    isLoading    // Loading state
  } = useTheme();

  return (
    <div>
      <p>Mode: {mode}</p>
      <p>Theme: {theme}</p>
      <button onClick={() => setMode('dark')}>Dark Mode</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Utility Functions

```tsx
import {
  getSystemTheme,
  resolveTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  getThemeVariables
} from 'react-theme';

// Get system theme preference
const systemTheme = getSystemTheme(); // 'light' | 'dark'

// Resolve theme mode to actual theme
const resolvedTheme = resolveTheme('system'); // 'light' | 'dark'

// Get CSS variables for theme
const variables = getThemeVariables('dark');
```

## Tailwind CSS Setup

Add the following to your `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

## CSS Variables

The library automatically sets CSS variables for consistent theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... more variables */
}
```

## Next.js Integration

For Next.js, you might want to prevent hydration mismatches:

```tsx
// _app.tsx
import { ThemeProvider } from 'react-theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultMode="system">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

Add to your `_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('psr-theme') === 'dark' || 
                    (!localStorage.getItem('psr-theme') && 
                     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## TypeScript Support

The library is fully typed with TypeScript. All components and hooks include proper type definitions.

```tsx
import type { ThemeMode, ResolvedTheme, ThemeConfig } from 'react-theme';

const config: ThemeConfig = {
  defaultMode: 'system',
  storageKey: 'my-theme',
  enableSystem: true
};
```

## Custom Icons

You can provide custom icons for the theme toggle:

```tsx
import { ThemeToggle } from 'react-theme';
import { Sun, Moon, Monitor } from 'lucide-react';

<ThemeToggle
  icons={{
    light: <Sun size={16} />,
    dark: <Moon size={16} />,
    system: <Monitor size={16} />
  }}
  labels={{
    light: 'Light Theme',
    dark: 'Dark Theme',
    system: 'System Theme'
  }}
/>
```

## Advanced Usage

### Higher-Order Component

```tsx
import { withTheme } from 'react-theme';

const MyComponent = withTheme(({ theme }) => (
  <div className={theme === 'dark' ? 'dark-styles' : 'light-styles'}>
    Content
  </div>
));
```

### Custom Storage Provider

```tsx
// Using sessionStorage instead of localStorage
<ThemeProvider storageProvider={sessionStorage}>
  <App />
</ThemeProvider>
```

### Theme Change Callbacks

```tsx
<ThemeToggle
  onThemeChange={(mode) => {
    console.log('Theme changed to:', mode);
    // Analytics, logging, etc.
  }}
/>
```

## API Reference

### Types

```typescript
type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
  modes: ThemeMode[];
  isLoading: boolean;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/psr-world/react-theme).