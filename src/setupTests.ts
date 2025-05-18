// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill para TextEncoder e TextDecoder
class TextEncoderPolyfill {
  encode(text: string): Uint8Array {
    const encoded = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
      encoded[i] = text.charCodeAt(i);
    }
    return encoded;
  }
}

class TextDecoderPolyfill {
  decode(arrayBuffer: Uint8Array): string {
    let decoded = '';
    for (let i = 0; i < arrayBuffer.length; i++) {
      decoded += String.fromCharCode(arrayBuffer[i]);
    }
    return decoded;
  }
}

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoderPolyfill as any;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoderPolyfill as any;
}

// Mock do localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock para IntersectionObserver que não está disponível no ambiente de teste
class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Outros mocks globais, se necessário
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};
