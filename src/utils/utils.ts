import commaNumber from 'comma-number'
export const formatter = (number) => commaNumber(Number(number).toFixed(2))
