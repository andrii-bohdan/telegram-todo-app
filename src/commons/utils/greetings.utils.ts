import { isNumber } from './isNumber.utils';
export const greetings = (time: string): string => {
  const currentTime = isNumber(time);

  if (currentTime >= 3 && currentTime <= 12) {
    return 'Good morning';
  } else if (currentTime >= 12 && currentTime <= 15) {
    return 'Good afternoon';
  } else if (currentTime >= 15 && currentTime <= 20) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
};
