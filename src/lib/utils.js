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

export function ownerDocument(node) {
  return (node && node.ownerDocument) || document;
}

export function ownerWindow(node) {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}
