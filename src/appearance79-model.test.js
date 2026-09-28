import { appearance75 } from './appearance75-model';

describe('editorial background preference', () => {
  test('has a quiet default and only accepts curated readable palettes', () => {
    expect(appearance75(null).surface).toBe('paper');
    expect(appearance75({ surface: 'mist' }).surface).toBe('mist');
    expect(appearance75({ surface: 'not-a-color' }).surface).toBe('paper');
  });
});
