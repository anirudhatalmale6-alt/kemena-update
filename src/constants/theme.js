export const COLORS = {
  primary: '#1a5276',
  primaryDark: '#0e3a54',
  primaryLight: '#2980b9',
  white: '#ffffff',
  black: '#111111',
  gray: '#666666',
  lightGray: '#f5f5f5',
  mediumGray: '#e0e0e0',
  darkGray: '#333333',
  background: '#f8f8f8',
  card: '#ffffff',
  text: '#222222',
  textSecondary: '#666666',
  border: '#e0e0e0',
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text },
  medium: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  bold: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  header: { fontSize: 24, fontWeight: '700', color: COLORS.white },
  small: { fontSize: 12, color: COLORS.textSecondary },
};

export const SIZES = {
  padding: 16,
  paddingSmall: 8,
  paddingLarge: 24,
  radius: 12,
  radiusSmall: 8,
};

export const API_BASE = 'https://www.kemenaupdate.com/wp-json/wp/v2';
