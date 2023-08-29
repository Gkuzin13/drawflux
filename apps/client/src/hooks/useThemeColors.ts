import { useTheme } from '@/contexts/theme';
import { getCurrentThemeColors } from '@/utils/shape';
import { useMemo } from 'react';

function useThemeColors() {
  const theme = useTheme();

  const themeColors = useMemo(
    () => getCurrentThemeColors({ isDarkTheme: theme.value === 'dark' }),
    [theme.value],
  );

  return themeColors;
}

export default useThemeColors;
