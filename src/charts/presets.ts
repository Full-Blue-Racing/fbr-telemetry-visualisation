/**
 * Pre-built SeriesSelector arrays for each chart type
 * listed in the README TODOs.
 */

import type { SeriesSelector } from './adapter';
import { COLORS } from './colors';

// ---- Wheel Speed ----

export const WHEEL_SPEED_ALL: readonly SeriesSelector[] = [
  { label: 'Front Left', color: COLORS.blue, extract: (f) => f.wheelSpeed?.frontLeft },
  { label: 'Front Right', color: COLORS.red, extract: (f) => f.wheelSpeed?.frontRight },
  { label: 'Back Left', color: COLORS.green, extract: (f) => f.wheelSpeed?.backLeft },
  { label: 'Back Right', color: COLORS.orange, extract: (f) => f.wheelSpeed?.backRight },
];

export const WHEEL_SPEED_FRONT: readonly SeriesSelector[] = [
  { label: 'Front Left', color: COLORS.blue, extract: (f) => f.wheelSpeed?.frontLeft },
  { label: 'Front Right', color: COLORS.red, extract: (f) => f.wheelSpeed?.frontRight },
];

export const WHEEL_SPEED_BACK: readonly SeriesSelector[] = [
  { label: 'Back Left', color: COLORS.green, extract: (f) => f.wheelSpeed?.backLeft },
  { label: 'Back Right', color: COLORS.orange, extract: (f) => f.wheelSpeed?.backRight },
];

export const WHEEL_SPEED_FL: readonly SeriesSelector[] = [
  { label: 'Front Left', color: COLORS.blue, extract: (f) => f.wheelSpeed?.frontLeft },
];

export const WHEEL_SPEED_FR: readonly SeriesSelector[] = [
  { label: 'Front Right', color: COLORS.red, extract: (f) => f.wheelSpeed?.frontRight },
];

export const WHEEL_SPEED_BL: readonly SeriesSelector[] = [
  { label: 'Back Left', color: COLORS.green, extract: (f) => f.wheelSpeed?.backLeft },
];

export const WHEEL_SPEED_BR: readonly SeriesSelector[] = [
  { label: 'Back Right', color: COLORS.orange, extract: (f) => f.wheelSpeed?.backRight },
];

// ---- Damper Position (Linear Position Sensors) ----

export const DAMPER_POSITION_ALL: readonly SeriesSelector[] = [
  { label: 'Front Left', color: COLORS.blue, extract: (f) => f.damperPosition?.frontLeft },
  { label: 'Front Right', color: COLORS.red, extract: (f) => f.damperPosition?.frontRight },
  { label: 'Back Left', color: COLORS.green, extract: (f) => f.damperPosition?.backLeft },
  { label: 'Back Right', color: COLORS.orange, extract: (f) => f.damperPosition?.backRight },
];

export const DAMPER_POSITION_FRONT: readonly SeriesSelector[] = [
  { label: 'Front Left', color: COLORS.blue, extract: (f) => f.damperPosition?.frontLeft },
  { label: 'Front Right', color: COLORS.red, extract: (f) => f.damperPosition?.frontRight },
];

export const DAMPER_POSITION_BACK: readonly SeriesSelector[] = [
  { label: 'Back Left', color: COLORS.green, extract: (f) => f.damperPosition?.backLeft },
  { label: 'Back Right', color: COLORS.orange, extract: (f) => f.damperPosition?.backRight },
];

export const DAMPER_POSITION_FL: readonly SeriesSelector[] = [
  { label: 'Front Left', color: COLORS.blue, extract: (f) => f.damperPosition?.frontLeft },
];

export const DAMPER_POSITION_FR: readonly SeriesSelector[] = [
  { label: 'Front Right', color: COLORS.red, extract: (f) => f.damperPosition?.frontRight },
];

export const DAMPER_POSITION_BL: readonly SeriesSelector[] = [
  { label: 'Back Left', color: COLORS.green, extract: (f) => f.damperPosition?.backLeft },
];

export const DAMPER_POSITION_BR: readonly SeriesSelector[] = [
  { label: 'Back Right', color: COLORS.orange, extract: (f) => f.damperPosition?.backRight },
];

// ---- Acceleration ----

export const ACCELERATION: readonly SeriesSelector[] = [
  { label: 'Accel X', color: COLORS.blue, extract: (f) => f.imu?.acceleration.x },
  { label: 'Accel Y', color: COLORS.red, extract: (f) => f.imu?.acceleration.y },
  { label: 'Accel Z', color: COLORS.green, extract: (f) => f.imu?.acceleration.z },
];

// ---- Speed ----

export const GPS_SPEED: readonly SeriesSelector[] = [
  { label: 'GPS Speed', color: COLORS.blue, extract: (f) => f.gps?.speed },
];
