import { isNumber } from './isNumber.utils';
describe('Check is Number', () => {
  it('should check if string has number and convert it to number', () => {
    const data = '12314';
    const result = isNumber(data);
    expect(result).toBeTruthy();
  });
});
