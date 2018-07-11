import { trigger, state, style, transition, animate, keyframes, group } from '@angular/animations';

export const slideIn = trigger('slideIn', [
    state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        group([
          animate(300, style({
            color: 'red'
          })),
          animate(300, style({
            transform: 'translateX(100px)',
            opacity: 0
          }))
        ])
      ])
]);
