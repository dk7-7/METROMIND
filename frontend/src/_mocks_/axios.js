// Manual Jest mock for axios, used by tests that stub HTTP calls.
const mockAxios = {
  create: jest.fn(function create() {
    return mockAxios;
  }),
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

export default mockAxios;
