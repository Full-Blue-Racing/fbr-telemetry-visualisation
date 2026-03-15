/**
 * Converts a CSV file to length-prefixed FlatBuffer binary.
 * Output: public/data/telemetry.bin
 *
 * Usage: pnpm run convert:csv <input.csv>
 *
 * Column auto-detection: matches common header patterns to telemetry fields.
 * Unrecognized columns are skipped with a warning.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as flatbuffers from 'flatbuffers';
import { Frame } from '../src/generated/telemetry/frame.js';
import { Timestamp } from '../src/generated/telemetry/timestamp.js';
import { Nanos } from '../src/generated/telemetry/nanos.js';
import { GPSFrame } from '../src/generated/telemetry/gpsframe.js';
import { IMUFrame } from '../src/generated/telemetry/imuframe.js';
import { WheelSpeedFrame } from '../src/generated/telemetry/wheel-speed-frame.js';
import { DamperPositionFrame } from '../src/generated/telemetry/damper-position-frame.js';

const OUTPUT_PATH = path.join('public', 'data', 'telemetry.bin');

// ---- Column mapping patterns ----

interface ColumnMatcher {
  pattern: RegExp;
  field: string;
}

const COLUMN_MATCHERS: ColumnMatcher[] = [
  // Timestamp
  { pattern: /^(time_?)?seconds?$/i, field: 'time_seconds' },
  { pattern: /^(time_?)?nano(second)?s?$/i, field: 'time_nanoseconds' },
  { pattern: /^clock(_?nanos)?|^nanos$/i, field: 'clock_nanos' },
  { pattern: /^time(stamp)?$/i, field: 'time_seconds' },

  // GPS
  { pattern: /^(gps_?)?lat(itude)?$/i, field: 'gps_lat' },
  { pattern: /^(gps_?)?l(o)?ng(itude)?$/i, field: 'gps_lng' },
  { pattern: /^(gps_?)?speed$/i, field: 'gps_speed' },
  { pattern: /^(gps_?)?alt(itude)?$/i, field: 'gps_altitude' },
  { pattern: /^(gps_?)?heading$/i, field: 'gps_heading' },

  // IMU - Acceleration
  { pattern: /^(imu_?)?(accel(eration)?_?)?x$/i, field: 'imu_accel_x' },
  { pattern: /^(imu_?)?(accel(eration)?_?)?y$/i, field: 'imu_accel_y' },
  { pattern: /^(imu_?)?(accel(eration)?_?)?z$/i, field: 'imu_accel_z' },

  // IMU - Angular velocity
  { pattern: /^(imu_?)?ang(ular)?_?vel(ocity)?_?x$/i, field: 'imu_angvel_x' },
  { pattern: /^(imu_?)?ang(ular)?_?vel(ocity)?_?y$/i, field: 'imu_angvel_y' },
  { pattern: /^(imu_?)?ang(ular)?_?vel(ocity)?_?z$/i, field: 'imu_angvel_z' },

  // IMU - Magnetometer
  { pattern: /^(imu_?)?mag(net(o?meter)?)?_?x$/i, field: 'imu_mag_x' },
  { pattern: /^(imu_?)?mag(net(o?meter)?)?_?y$/i, field: 'imu_mag_y' },
  { pattern: /^(imu_?)?mag(net(o?meter)?)?_?z$/i, field: 'imu_mag_z' },

  // Wheel speed
  { pattern: /^(wheel_?speed_?|ws_?)?f(ront)?_?l(eft)?$/i, field: 'ws_fl' },
  { pattern: /^(wheel_?speed_?|ws_?)?f(ront)?_?r(ight)?$/i, field: 'ws_fr' },
  { pattern: /^(wheel_?speed_?|ws_?)?b(ack)?_?l(eft)?$/i, field: 'ws_bl' },
  { pattern: /^(wheel_?speed_?|ws_?)?b(ack)?_?r(ight)?$/i, field: 'ws_br' },

  // Damper position
  { pattern: /^(damper_?|dp_?|lin_?pos_?)?f(ront)?_?l(eft)?_?(damper|pos)?$/i, field: 'dp_fl' },
  { pattern: /^(damper_?|dp_?|lin_?pos_?)?f(ront)?_?r(ight)?_?(damper|pos)?$/i, field: 'dp_fr' },
  { pattern: /^(damper_?|dp_?|lin_?pos_?)?b(ack)?_?l(eft)?_?(damper|pos)?$/i, field: 'dp_bl' },
  { pattern: /^(damper_?|dp_?|lin_?pos_?)?b(ack)?_?r(ight)?_?(damper|pos)?$/i, field: 'dp_br' },
];

// ---- Parsed row ----

interface ParsedRow {
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

function emptyRow(): ParsedRow {
  return {
    time_seconds: 0, time_nanoseconds: 0, clock_nanos: 0,
    gps_lat: 0, gps_lng: 0, gps_speed: 0, gps_altitude: 0, gps_heading: 0,
    imu_accel_x: 0, imu_accel_y: 0, imu_accel_z: 0,
    imu_angvel_x: 0, imu_angvel_y: 0, imu_angvel_z: 0,
    imu_mag_x: 0, imu_mag_y: 0, imu_mag_z: 0,
    ws_fl: 0, ws_fr: 0, ws_bl: 0, ws_br: 0,
    dp_fl: 0, dp_fr: 0, dp_bl: 0, dp_br: 0,
  };
}

// ---- Column detection ----

function detectColumns(headers: string[]): Map<number, string> {
  const mapping = new Map<number, string>();

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].trim();
    const matcher = COLUMN_MATCHERS.find((m) => m.pattern.test(header));

    if (matcher) {
      mapping.set(i, matcher.field);
      console.log(`  Column ${i} "${header}" -> ${matcher.field}`);
    } else {
      console.warn(`  Column ${i} "${header}" -> (unmapped, skipped)`);
    }
  }

  return mapping;
}

// ---- Build FlatBuffer frame ----

function buildFrameFromRow(row: ParsedRow): Uint8Array {
  const builder = new flatbuffers.Builder(256);

  // Structs must be created inline (immediately before their addField call)
  Frame.startFrame(builder);

  Frame.addDamperFrame(builder, DamperPositionFrame.createDamperPositionFrame(
    builder,
    row.dp_fl, row.dp_fr, row.dp_bl, row.dp_br,
  ));

  Frame.addWheelFrame(builder, WheelSpeedFrame.createWheelSpeedFrame(
    builder,
    row.ws_fl, row.ws_fr, row.ws_bl, row.ws_br,
  ));

  Frame.addImuFrame(builder, IMUFrame.createIMUFrame(
    builder,
    row.imu_accel_x, row.imu_accel_y, row.imu_accel_z,
    row.imu_angvel_x, row.imu_angvel_y, row.imu_angvel_z,
    row.imu_mag_x, row.imu_mag_y, row.imu_mag_z,
  ));

  Frame.addGpsFrame(builder, GPSFrame.createGPSFrame(
    builder,
    row.gps_lat, row.gps_lng, row.gps_speed,
    row.gps_altitude, row.gps_heading,
  ));

  Frame.addClocks(builder, Nanos.createNanos(
    builder,
    BigInt(Math.floor(row.clock_nanos)),
  ));

  Frame.addTime(builder, Timestamp.createTimestamp(
    builder,
    BigInt(Math.floor(row.time_seconds)),
    BigInt(Math.floor(row.time_nanoseconds)),
  ));

  const frameOffset = Frame.endFrame(builder);

  Frame.finishSizePrefixedFrameBuffer(builder, frameOffset);

  return builder.asUint8Array();
}

// ---- Main ----

function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Usage: pnpm run convert:csv <input.csv>');
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`File not found: ${inputFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');

  if (lines.length < 2) {
    console.error('CSV must have at least a header row and one data row');
    process.exit(1);
  }

  const headers = lines[0].split(',');
  console.log(`Detected ${headers.length} columns:`);
  const columnMapping = detectColumns(headers);

  if (columnMapping.size === 0) {
    console.error('No columns could be mapped to telemetry fields');
    process.exit(1);
  }

  const chunks: Uint8Array[] = [];
  let totalSize = 0;

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',');
    const row = emptyRow();

    for (const [colIndex, field] of columnMapping) {
      const value = Number(cells[colIndex]);
      if (!Number.isNaN(value)) {
        row[field as keyof ParsedRow] = value;
      }
    }

    const frameBytes = buildFrameFromRow(row);
    chunks.push(frameBytes);
    totalSize += frameBytes.byteLength;
  }

  // Concatenate
  const output = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }

  // Write
  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`Converted ${chunks.length} rows (${totalSize} bytes) -> ${OUTPUT_PATH}`);
}

main();
