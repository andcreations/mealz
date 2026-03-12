export const PathTo: { [key: string]: Function } = {
  dflt:() => {
    return PathTo.dashboard();
  },

  dashboard: () => {
    return '/';
  },

  chef: () => {
    return '/chef';
  },

  settings: () => {
    return '/settings';
  },

  hydrationDailyPlan: () => {
    return '/settings/hydration-plan';
  },

  dailyMealPlan: () => {
    return '/settings/daily-meal-plan';
  },

  telegramSettings: () => {
    return '/settings/telegram';
  },

  calculatorSettings: () => {
    return '/settings/calculator';
  },

  signIn: (to?: string) => {
    const toParam = to ? `?to=${to}`: '';
    return `/sign-in${toParam}`;
  },

  href: (path: string) => {
    return `/#${path}`;
  },
}