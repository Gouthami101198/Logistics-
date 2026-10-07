import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
export type FontSize = 'compact' | 'normal' | 'relaxed';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  cycleFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('logitrack_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark'; // default to cyber dark mode
    } catch {
      return 'dark';
    }
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    try {
      const savedSize = localStorage.getItem('logitrack_fontsize') as FontSize | null;
      if (savedSize === 'compact' || savedSize === 'normal' || savedSize === 'relaxed') {
        return savedSize;
      }
      return 'normal'; // 14px (reduced from 16px)
    } catch {
      return 'normal';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('logitrack_theme', theme);
    } catch {
      // storage unavailable
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('logitrack_fontsize', fontSize);
    } catch {
      // storage unavailable
    }

    const root = document.documentElement;
    const pxMap: Record<FontSize, string> = {
      compact: '13px',
      normal: '14px',
      relaxed: '15.5px',
    };
    root.style.fontSize = pxMap[fontSize];
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const cycleFontSize = () => {
    setFontSizeState((prev) => {
      if (prev === 'normal') return 'compact';
      if (prev === 'compact') return 'relaxed';
      return 'normal';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === 'dark',
        fontSize,
        setFontSize,
        cycleFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
