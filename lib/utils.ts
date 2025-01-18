/*
 * width = Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel
 * padding}]/{Maximum Digit Width}*256)/256
*/
export const convertExcelWidth = (value: number) => {
  return value * 16
}
