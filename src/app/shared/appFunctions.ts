export function appArrayPopAt<T>(
  array: T[], index: number
) : T[] {
  let newArray: T[] = [];
  let length: number = array.length;
  for (let i = 0; i < length; i++) {
    if (i < index) {
      newArray.push(array[i]);
    }
    else if (i === index) {
      continue;
    }
    else {
      newArray.push(array[i]);
    }
  }
  return newArray;
}
export function appRound(input: number, digits: number) : number {
  let scale: number = Math.pow(10, digits);
  let eps: number = 1 / (scale); // for floating point weirdness
  return Math.round(input * scale + eps) / scale;
}
export function appIsEmptyObject(obj: Object) : boolean {
  for (let prop in obj) {
    return false;
  }
  return true;
}
