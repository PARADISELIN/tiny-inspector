export function isAllElementEqualArray(data: Array<string | number>): boolean {
  if (data.length === 0) return false
  if (data.length === 1) return true

  return data.every(item => item === data[0])
}
