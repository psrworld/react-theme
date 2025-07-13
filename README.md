# react-theme

A comprehensive theme provider for React applications with dark/light/system mode support. Built with TypeScript and designed to work seamlessly with Tailwind CSS.

## Features

- 🌙 **Dark/Light/System themes** - Complete theme switching with system preference detection
- 🎨 **Tailwind CSS integration** - Works perfectly with Tailwind's dark mode
- 💾 **Persistent storage** - Remembers user preference with localStorage
- 🔄 **System theme detection** - Automatically follows system dark/light preference
- 🎯 **TypeScript support** - Fully typed with comprehensive type definitions
- 📱 **Responsive design** - Works on all screen sizes
- 🎛️ **Customizable components** - Flexible ThemeToggle component with multiple variants

## Installation

```bash
npm install react-theme
```

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider, ThemeToggle } from 'react-theme';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <header className="p-4">
          <ThemeToggle ThemeLabel={true} ThemeIcon={true} />
        </header>
        
        <main className="p-6">
          <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Your Content
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              This content will automatically adapt to the selected theme.
            </p>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

### 2. Configure Tailwind CSS

Add the following to your `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',
  // ... rest of your config
}
```

## API Reference

### ThemeProvider

The main provider component that manages theme state and persistence.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Child components |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Default theme when no stored preference |
| `storageKey` | `string` | `'psr-theme'` | localStorage key for persisting theme |
| `attribute` | `string` | `'class'` | HTML attribute to set theme |
| `enableSystem` | `boolean` | `true` | Enable system theme detection |

### ThemeToggle

A ready-to-use theme toggle button component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ThemeLabel` | `boolean` | `true` | Show theme label text |
| `ThemeIcon` | `boolean` | `true` | Show theme icon |
| `className` | `string` | `''` | Additional CSS classes |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'outline'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |

### useTheme Hook

Access and control theme state from any component.

```tsx
import { useTheme } from 'react-theme';

function MyComponent() {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `'light' \| 'dark' \| 'system'` | Current theme setting |
| `setTheme` | `(theme: Theme) => void` | Function to change theme |
| `resolvedTheme` | `'light' \| 'dark'` | Actual theme being used |
| `systemTheme` | `'light' \| 'dark'` | Current system theme |
| `toggleTheme` | `() => void` | Cycle through themes |
| `isSystemTheme` | `boolean` | Whether system theme is active |

## Theme Variants

### ThemeToggle Variants

```tsx
// Default variant
<ThemeToggle variant="default" />

// Outline variant (recommended)
<ThemeToggle variant="outline" />

// Ghost variant
<ThemeToggle variant="ghost" />
```

### ThemeToggle Sizes

```tsx
// Small
<ThemeToggle size="sm" />

// Medium (default)
<ThemeToggle size="md" />

// Large
<ThemeToggle size="lg" />
```

## CSS Integration

The theme provider automatically applies the following:

1. **CSS Classes**: Adds `light` or `dark` class to `<html>` element
2. **Data Attribute**: Sets `data-theme` attribute
3. **Color Scheme**: Updates CSS `color-scheme` property

### Custom CSS

You can use standard CSS with the theme classes:

```css
/* Light theme styles */
.light .my-component {
  background-color: white;
  color: black;
}

/* Dark theme styles */
.dark .my-component {
  background-color: #1a1a1a;
  color: white;
}

/* Or using CSS custom properties */
:root {
  --bg-color: white;
  --text-color: black;
}

.dark {
  --bg-color: #1a1a1a;
  --text-color: white;
}

.my-component {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

## Advanced Usage

### Custom Theme Toggle

Create your own theme toggle component:

```tsx
import React from 'react';
import { useTheme } from 'react-theme';

function CustomThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1 rounded ${
          theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1 rounded ${
          theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1 rounded ${
          theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        System
      </button>
    </div>
  );
}
```

### Theme-aware Components

Create components that adapt to theme changes:

```tsx
import React from 'react';
import { useTheme } from 'react-theme';

function ThemeAwareComponent() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={`p-4 rounded-lg ${
      resolvedTheme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <h3>Current theme: {resolvedTheme}</h3>
      <p>This component adapts to the current theme.</p>
    </div>
  );
}
```

### Server-Side Rendering (SSR)

For SSR applications, you might want to prevent hydration mismatches:

```tsx
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'react-theme';

function App() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div>Loading...</div>;
  }
  
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Utilities

The package also exports utility functions for advanced use cases:

```tsx
import {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  getThemeLabel,
  getNextTheme
} from 'react-theme';

// Get current system theme
const systemTheme = getSystemTheme(); // 'light' | 'dark'

// Get stored theme from localStorage
const storedTheme = getStoredTheme('my-theme-key');

// Store theme in localStorage
setStoredTheme('dark', 'my-theme-key');

// Apply theme to DOM
applyTheme('dark', 'light', 'class');

// Get human-readable theme label
const label = getThemeLabel('system'); // 'System mode'

// Get next theme in cycle
const nextTheme = getNextTheme('light'); // 'dark'
```

## Examples

### Basic Setup

```tsx
import React from 'react';
import { ThemeProvider, ThemeToggle } from 'react-theme';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <nav className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              My App
            </h1>
            <ThemeToggle />
          </div>
        </nav>
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Welcome to My App
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This app supports light, dark, and system themes.
            </p>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

### Icon-only Toggle

```tsx
<ThemeToggle ThemeLabel={false} ThemeIcon={true} variant="ghost" size="sm" />
```

### Label-only Toggle

```tsx
<ThemeToggle ThemeLabel={true} ThemeIcon={false} variant="outline" />
```

### Custom Styling

```tsx
<ThemeToggle 
  className="border-2 border-blue-500 hover:border-blue-600" 
  variant="outline"
  size="lg"
/>
```

## TypeScript Support

The package is fully typed with comprehensive TypeScript definitions:

```tsx
import type { 
  Theme, 
  ThemeContextType, 
  ThemeProviderProps, 
  ThemeToggleProps, 
  UseThemeReturn 
} from 'react-theme';

// All types are available for your use
const myTheme: Theme = 'dark';
```

## Browser Support

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Changelog

### v1.0.0
- Initial release
- ThemeProvider component
- ThemeToggle component
- useTheme hook
- Full TypeScript support
- Tailwind CSS integration
- System theme detection
- localStorage persistence
