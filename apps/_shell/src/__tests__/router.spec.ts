import { describe, it, expect } from 'vitest';
import routes from '../router';

describe('Router Configuration', () => {
  it('has root path redirecting to /hello', () => {
    const rootRoute = routes.find((route) => route.path === '/');
    expect(rootRoute).toBeDefined();
    expect(rootRoute?.redirect).toBe('/hello');
  });

  it('has /hello route configured', () => {
    const helloRoute = routes.find((route) => route.path === '/hello');
    expect(helloRoute).toBeDefined();
    expect(helloRoute?.component).toBeDefined();
  });

  it('exports array of route records', () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });
});
