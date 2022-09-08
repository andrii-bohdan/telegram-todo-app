export const isNumber = (value: any, convertToNumber: boolean = true) => {
  const pattern: RegExp = /^\d+\.?\d*$/;
  if (!pattern.test(value)) {
    throw new Error('The value must have a characters number!');
  }
  return convertToNumber ? Number(value) : value;
};
