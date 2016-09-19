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
