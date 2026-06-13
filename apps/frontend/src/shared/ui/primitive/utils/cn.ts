import classnames from 'classnames';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: Parameters<typeof classnames>) =>
  twMerge(classnames(...inputs));
