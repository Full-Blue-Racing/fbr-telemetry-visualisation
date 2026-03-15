/**
 * Generates mock telemetry data as length-prefixed FlatBuffer binary.
 * Output: public/data/telemetry.bin
 *
 * Usage: pnpm run generate:mock-bin
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
import { generateAllRows, FRAME_COUNT, SAMPLE_RATE_HZ } from './mock-data.js';
import type { MockRow } from './mock-data.js';

const OUTPUT_PATH = path.join('public', 'data', 'telemetry.bin');

function rowToFlatBuffer(row: MockRow): Uint8Array {
  const builder = new flatbuffers.Builder(256);

  Frame.startFrame(builder);

  Frame.addDamperFrame(builder, DamperPositionFrame.createDamperPositionFrame(
    builder, row.dp_fl, row.dp_fr, row.dp_bl, row.dp_br,
  ));

  Frame.addWheelFrame(builder, WheelSpeedFrame.createWheelSpeedFrame(
    builder, row.ws_fl, row.ws_fr, row.ws_bl, row.ws_br,
  ));

  Frame.addImuFrame(builder, IMUFrame.createIMUFrame(
    builder,
    row.imu_accel_x, row.imu_accel_y, row.imu_accel_z,
    row.imu_angvel_x, row.imu_angvel_y, row.imu_angvel_z,
    row.imu_mag_x, row.imu_mag_y, row.imu_mag_z,
  ));

  Frame.addGpsFrame(builder, GPSFrame.createGPSFrame(
    builder, row.gps_lat, row.gps_lng, row.gps_speed,
    row.gps_altitude, row.gps_heading,
  ));

  Frame.addClocks(builder, Nanos.createNanos(
    builder, BigInt(row.clock_nanos),
  ));

  Frame.addTime(builder, Timestamp.createTimestamp(
    builder, BigInt(row.time_seconds), BigInt(row.time_nanoseconds),
  ));

  const frameOffset = Frame.endFrame(builder);
  Frame.finishSizePrefixedFrameBuffer(builder, frameOffset);

  return builder.asUint8Array();
}

function main() {
  const rows = generateAllRows();

  const chunks: Uint8Array[] = [];
  let totalSize = 0;

  for (const row of rows) {
    const bytes = rowToFlatBuffer(row);
    chunks.push(bytes);
    totalSize += bytes.byteLength;
  }

  const output = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`Generated ${FRAME_COUNT} frames (${totalSize} bytes) -> ${OUTPUT_PATH}`);
  console.log(`Duration: ${(FRAME_COUNT / SAMPLE_RATE_HZ).toFixed(1)}s at ${SAMPLE_RATE_HZ} Hz`);
}

main();
