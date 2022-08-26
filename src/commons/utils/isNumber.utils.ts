export const isNumber = (value: any, convertToNumber: boolean = true) => {
  const pattern: RegExp = /^\d+\.?\d*$/;
  if (!pattern.test(value)) {
    throw new Error('Please type number to delete todo');
  }
  return convertToNumber ? Number(value) : value;
};
