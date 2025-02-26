
export type DurationType = 'days' | 'months' | 'years';

export const convertToDays = (duration: number, unit: DurationType): number => {
  switch (unit) {
    case 'days':
      return duration;
    case 'months':
      return duration * 30;
    case 'years':
      return duration * 365;
    default:
      return duration;
  }
};

export const validateNextTier = (
  prevDuration: number,
  prevUnit: DurationType,
  nextDuration: number,
  nextUnit: DurationType
): boolean => {
  const prevInDays = convertToDays(prevDuration, prevUnit);
  const nextInDays = convertToDays(nextDuration, nextUnit);
  return nextInDays > prevInDays;
};

export const getAvailableUnits = (prevUnit?: DurationType): DurationType[] => {
  if (!prevUnit) return ['days', 'months', 'years'];
  
  switch (prevUnit) {
    case 'days':
      return ['days', 'months', 'years'];
    case 'months':
      return ['months', 'years'];
    case 'years':
      return ['years'];
    default:
      return ['days', 'months', 'years'];
  }
};
