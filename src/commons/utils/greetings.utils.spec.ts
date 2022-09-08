import { greetings } from './greetings.utils';
describe('Greetings', () => {
  it('should return a greetings string', () => {
    const greetingsFlow = {
      morning: {
        time: '9',
        message: 'Good morning',
      },
      afternoon: {
        time: '13',
        message: 'Good afternoon',
      },
      evening: {
        time: '17',
        message: 'Good evening',
      },
      night: {
        time: '23',
        message: 'Good night',
      },
    };

    for (let flow in greetingsFlow) {
      const result = greetings(greetingsFlow[flow].time);
      expect(result).toBe(greetingsFlow[flow].message);
    }
  });
});
