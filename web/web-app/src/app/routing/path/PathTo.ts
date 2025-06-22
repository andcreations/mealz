export const PathTo: { [key: string]: Function } = {
  home: () => {
    return '/';
  },

  signIn: (to?: string) => {
    const toParam = to ? `?to=${to}`: '';
    return `/sign-in${toParam}`;
  },  
}