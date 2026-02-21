import { Translations } from '../../../i18n';

export const HydrationDailyPlanSettingsTranslations: Translations = {
  'glasses-label': 'Number of glasses',
  'glasses-details':
    `Number of glasses of water to drink daily. ` +
    `It is very important to stay hydrated.` +
    `Water helps control hunger and improve digestion.`,

  'reminders-label': 'Reminders enabled',
  'reminders-details':
    `You will be notified to drink water on Telegram if you forget.`,

  'start-time-label': 'Start time',
  'start-time-details': `The time when the reminders will start.`,
  'start-time-after-end-time': 'Start time must be before end time',

  'end-time-label': 'End time',
  'end-time-details': `The time when the reminders will end.`,
  'end-time-before-start-time': 'End time must be after start time',

  'start-time-modal-details': `Pick the reminders start time`,
  'end-time-modal-details': `Pick the reminders end time`,

  'minutes-since-last-water-intake-label': 'Minutes since last water intake',
  'minutes-since-last-water-intake-details':
    `Number of minutes since the last water intake ` +
    `that must pass before the next reminder. ` +
    `Must be 5 minutes at least.`,

  'period-in-minutes-label': 'Minutes between reminders',
  'period-in-minutes-details':
    `Number of minutes between reminders. ` +
    `Must be 5 minutes at least.`,

  'default-settings-notification':
    'Default settings applied. ' +
    'Change them accordingly.',
    
  'failed-to-apply-daily-plan': 'Failed to apply daily plan',
  'daily-plan-applied': 'Daily plan applied',

  'apply': 'Apply',
  'taking-longer': 'Taking longer than usual',
};