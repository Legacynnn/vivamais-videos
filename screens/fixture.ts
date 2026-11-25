export interface Fixture {
  props?: Record<string, unknown>;
  form?: Record<string, unknown>;
  params?: Record<string, string>;
  pathname?: string;
  user?: Record<string, unknown> | null;
  role?: 'client' | 'doctor';
  [key: string]: unknown;
}

export const fixture = (): Fixture => (globalThis as { __vmsFixture?: Fixture }).__vmsFixture ?? {};
