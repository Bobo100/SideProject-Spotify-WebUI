
export const getThemeClassName = (className: string, styles: any, theme?: string) => {
    const themeSuffix = theme === 'light' ? '_light' : '_dark';
    return styles[className + themeSuffix];
};