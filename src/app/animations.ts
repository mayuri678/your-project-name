import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

export const fadeSlideIn = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const cardAnimation = trigger('cardAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-20px)' }),
      stagger(100, animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })))
    ], { optional: true })
  ])
]);