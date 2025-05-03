// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window functions that are used by our components
Object.defineProperty(window, 'saveNodeChanges', {
  writable: true,
  value: jest.fn()
});

Object.defineProperty(window, 'cancelNodeChanges', {
  writable: true,
  value: jest.fn()
});

Object.defineProperty(window, 'isNodeModified', {
  writable: true,
  value: false
});

// Mock ResizeObserver which is used by some components but not available in JSDOM
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia which is used by MUI but not available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
