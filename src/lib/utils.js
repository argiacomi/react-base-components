import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  classGroups: {
    shadow: [{ shadow: ['paper1', 'paper2', 'paper3', 'paper4'] }]
  }
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
