export const PathTo: { [key: string]: Function } = {
  dflt:() => {
    return PathTo.chef();
  },

  home: () => {
    return '/';
  },

  chef: () => {
    return '/chef';
  },

  signIn: (to?: string) => {
    const toParam = to ? `?to=${to}`: '';
    return `/sign-in${toParam}`;
  },
}