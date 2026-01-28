import { setupZoneTestEnv } from "jest-preset-angular/setup-env/zone";

setupZoneTestEnv()


const mock = () => {
  let storage: { [key: string]: string } = {}
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ""),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {})
  }
}


Object.defineProperty(window, "localStorage", { value: mock() })
Object.defineProperty(window, "sessionStorage", { value: mock() })

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({ getPropertyValue: () => { } })
})

Object.defineProperty(document.body.style, "transform", {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    }
  }
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
})

console.info = jest.fn()
console.error = jest.fn()
console.warn = jest.fn()
console.log = jest.fn()
console.debug = jest.fn()
console.trace = jest.fn()