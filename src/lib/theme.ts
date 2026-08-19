import type { ResolvedTheme, Theme } from '../storage/schema';

export const resolveTheme = (preference: Theme | undefined): ResolvedTheme => {
	if (preference === 'light' || preference === 'dark') {
		return preference;
	}

	if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}

	return 'light';
};

export const themeCssForResolved = (resolved: ResolvedTheme, themeLight: string, themeDark: string) =>
	resolved === 'light' ? themeLight : themeDark;
