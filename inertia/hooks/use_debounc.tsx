export const useDebounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout

  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
