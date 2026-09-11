import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver. Stub it so hooks that
// observe sections (useScrollSpy, useScrollReveal) can be unit-tested.
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

// Guard against non-DOM test environments (e.g. `scripts/**/*.test.mjs`
// runs under `// @vitest-environment node`, where `window` does not exist).
if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
  window.IntersectionObserver = IntersectionObserverStub;
  globalThis.IntersectionObserver = IntersectionObserverStub;
}

// jsdom does not implement matchMedia. Stub it for responsive/media-query
// logic exercised in component tests.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });
}
