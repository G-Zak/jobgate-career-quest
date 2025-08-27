# Dark Mode Migration Examples

This document shows how to convert components from manual dark mode prop handling to Tailwind CSS dark mode variants.

## Before and After Examples

### Example 1: Button Component

**Before (Manual Props):**

```jsx
const Button = ({ isDarkMode, children, ...props }) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }
      `}
      {...props}
    >
      {children}
    </button>
  );
};
```

**After (Tailwind Dark Mode):**

```jsx
const Button = ({ children, ...props }) => {
  return (
    <button
      className="
        px-4 py-2 rounded-lg font-medium transition-colors
        bg-blue-500 hover:bg-blue-600 
        dark:bg-blue-600 dark:hover:bg-blue-700 
        text-white
      "
      {...props}
    >
      {children}
    </button>
  );
};
```

### Example 2: Card Component

**Before (Manual Props):**

```jsx
const Card = ({ isDarkMode, children, className = '' }) => {
  return (
    <div
      className={`
        rounded-xl shadow-sm p-6 transition-colors duration-300
        ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};
```

**After (Tailwind Dark Mode):**

```jsx
const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`
        rounded-xl shadow-sm p-6 transition-colors duration-300
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      {children}
    </div>
  );
};
```

### Example 3: Text Component

**Before (Manual Props):**

```jsx
const Text = ({ isDarkMode, variant = 'body', children }) => {
  const getClasses = () => {
    const base = 'transition-colors';

    switch (variant) {
      case 'heading':
        return `${base} text-2xl font-bold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`;
      case 'subtitle':
        return `${base} text-lg ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`;
      default:
        return `${base} ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`;
    }
  };

  return <p className={getClasses()}>{children}</p>;
};
```

**After (Tailwind Dark Mode):**

```jsx
const Text = ({ variant = 'body', children }) => {
  const getClasses = () => {
    const base = 'transition-colors';

    switch (variant) {
      case 'heading':
        return `${base} text-2xl font-bold text-gray-800 dark:text-gray-100`;
      case 'subtitle':
        return `${base} text-lg text-gray-600 dark:text-gray-300`;
      default:
        return `${base} text-gray-700 dark:text-gray-200`;
    }
  };

  return <p className={getClasses()}>{children}</p>;
};
```

### Example 4: Navigation Item

**Before (Manual Props):**

```jsx
const NavItem = ({ isDarkMode, isActive, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-4 py-3 rounded-lg text-left text-sm font-semibold transition-colors
        ${
          isActive
            ? 'text-blue-500 bg-blue-50 border-l-4 border-blue-500'
            : isDarkMode
            ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
            : 'text-gray-700 hover:bg-blue-50'
        }
      `}
    >
      {children}
    </button>
  );
};
```

**After (Tailwind Dark Mode):**

```jsx
const NavItem = ({ isActive, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-4 py-3 rounded-lg text-left text-sm font-semibold transition-colors
        ${
          isActive
            ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
            : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400'
        }
      `}
    >
      {children}
    </button>
  );
};
```

## Migration Steps

1. **Remove Dark Mode Props**: Remove `isDarkMode` prop from component parameters
2. **Replace Conditional Classes**: Convert `${isDarkMode ? 'dark-class' : 'light-class'}` to `light-class dark:dark-class`
3. **Update Component Usage**: Remove `isDarkMode={isDarkMode}` when using the component
4. **Use Dark Mode Context**: Import `useDarkMode` hook only where you need to toggle or read the current state

## Common Tailwind Dark Mode Patterns

### Background Colors

```css
/* Light background, dark background */
bg-white dark:bg-gray-800
bg-gray-50 dark:bg-gray-900
bg-blue-500 dark:bg-blue-600
```

### Text Colors

```css
/* Light text, dark text */
text-gray-800 dark:text-gray-100
text-gray-600 dark:text-gray-300
text-gray-500 dark:text-gray-400
```

### Border Colors

```css
/* Light border, dark border */
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600
```

### Hover States

```css
/* Light hover, dark hover */
hover:bg-gray-100 dark:hover:bg-gray-700
hover:text-gray-800 dark:hover:text-gray-200
```

## Benefits of Tailwind Dark Mode

1. **No Prop Drilling**: No need to pass `isDarkMode` through component hierarchy
2. **Automatic Switching**: Components automatically adapt based on the `dark` class on `<html>`
3. **Better Performance**: No JavaScript condition checking on every render
4. **Cleaner Code**: Styles are co-located and easier to read
5. **Better IntelliSense**: Full Tailwind autocomplete support

## Using the Dark Mode Context

Only import the context when you need to:

- Toggle dark mode (buttons, switches)
- Read current dark mode state for logic (not styling)

```jsx
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return <button onClick={toggleDarkMode}>{isDarkMode ? '☀️' : '🌙'}</button>;
};
```
