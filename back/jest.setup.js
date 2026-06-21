// Mock uuid before any tests run
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-mocked-123'),
}), { virtual: true });
