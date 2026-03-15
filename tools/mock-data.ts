/**
 * Shared mock telemetry data generation.
 * Used by both generate-mock-bin.ts and generate-mock-csv.ts.
 */

// Base GPS position (Silverstone Circuit, UK)
const BASE_LAT = 52.0786;
const BASE_LNG = -1.0169;

export const FRAME_COUNT = 1000;
export const SAMPLE_RATE_HZ = 100; // 100 Hz => 10 seconds of data

export interface MockRow {
  time_seconds: number;
  time_nanoseconds: number;
  clock_nanos: number;
  gps_lat: number;
  gps_lng: number;
  gps_speed: number;
  gps_altitude: number;
  gps_heading: number;
  imu_accel_x: number;
  imu_accel_y: number;
  imu_accel_z: number;
  imu_angvel_x: number;
  imu_angvel_y: number;
  imu_angvel_z: number;
  imu_mag_x: number;
  imu_mag_y: number;
  imu_mag_z: number;
  ws_fl: number;
  ws_fr: number;
  ws_bl: number;
  ws_br: number;
  dp_fl: number;
  dp_fr: number;
  dp_bl: number;
  dp_br: number;
}

export const CSV_HEADERS: (keyof MockRow)[] = [
  'time_seconds', 'time_nanoseconds', 'clock_nanos',
  'gps_lat', 'gps_lng', 'gps_speed', 'gps_altitude', 'gps_heading',
  'imu_accel_x', 'imu_accel_y', 'imu_accel_z',
  'imu_angvel_x', 'imu_angvel_y', 'imu_angvel_z',
  'imu_mag_x', 'imu_mag_y', 'imu_mag_z',
  'ws_fl', 'ws_fr', 'ws_bl', 'ws_br',
  'dp_fl', 'dp_fr', 'dp_bl', 'dp_br',
];

export function generateRow(index: number): MockRow {
  const t = index / SAMPLE_RATE_HZ;

  return {
    time_seconds: Math.floor(1700000000 + t),
    time_nanoseconds: Math.floor((t % 1) * 1_000_000_000),
    clock_nanos: Math.floor(t * 1_000_000_000),
    gps_lat: BASE_LAT + Math.sin(t * 0.1) * 0.001,
    gps_lng: BASE_LNG + Math.cos(t * 0.1) * 0.001,
    gps_speed: 60 + Math.sin(t * 0.5) * 20,
    gps_altitude: 150 + Math.sin(t * 0.05) * 5,
    gps_heading: (t * 36) % 360,
    imu_accel_x: Math.sin(t * 5) * 0.5,
    imu_accel_y: Math.cos(t * 3) * 0.3,
    imu_accel_z: -9.81 + Math.sin(t * 10) * 0.1,
    imu_angvel_x: Math.sin(t * 2) * 0.1,
    imu_angvel_y: Math.cos(t * 2) * 0.1,
    imu_angvel_z: Math.sin(t * 0.5) * 0.05,
    imu_mag_x: 25 + Math.sin(t) * 2,
    imu_mag_y: -10 + Math.cos(t) * 2,
    imu_mag_z: -45 + Math.sin(t * 0.3) * 1,
    ws_fl: 60 + Math.sin(t * 0.5) * 20 + Math.sin(t * 8) * 0.5,
    ws_fr: 60 + Math.sin(t * 0.5) * 20 + Math.cos(t * 8) * 0.5,
    ws_bl: 59 + Math.sin(t * 0.5) * 20 + Math.sin(t * 7) * 0.4,
    ws_br: 59 + Math.sin(t * 0.5) * 20 + Math.cos(t * 7) * 0.4,
    dp_fl: 50 + Math.sin(t * 3) * 10 + Math.sin(t * 15) * 2,
    dp_fr: 50 + Math.sin(t * 3) * 10 + Math.cos(t * 15) * 2,
    dp_bl: 50 + Math.sin(t * 2.5) * 8 + Math.sin(t * 12) * 1.5,
    dp_br: 50 + Math.sin(t * 2.5) * 8 + Math.cos(t * 12) * 1.5,
  };
}

export function generateAllRows(): MockRow[] {
  const rows: MockRow[] = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    rows.push(generateRow(i));
  }
  return rows;
}
