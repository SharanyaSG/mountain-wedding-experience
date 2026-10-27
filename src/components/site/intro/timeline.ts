export const INTRO_DURATION = 30;
export const INTRO_STORAGE_KEY = "gowda-malhotra:intro-seen:v1";
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const progress = (time: number, start: number, end: number) => clamp((time - start) / (end - start));
export const smooth = (n: number) => n * n * (3 - 2 * n);
export function introState(time: number) {
  return {
    hiking: time >= 3 && time < 8,
    summit: time >= 8 && time < 14,
    reveal: time >= 14 && time < 20,
    winter: smooth(progress(time, 20, 23)),
    skiing: time >= 23 && time < 27,
    epilogue: time >= 27 && time < INTRO_DURATION,
    finished: time >= INTRO_DURATION,
  };
}