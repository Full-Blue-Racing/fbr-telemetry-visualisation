/**
 * Reads length-prefixed FlatBuffer binary data and converts
 * each Frame into our internal TelemetryFrame type.
 *
 * Binary format: [4-byte LE size][frame data][4-byte LE size][frame data]...
 * Each frame is a size-prefixed FlatBuffer as produced by
 * Frame.finishSizePrefixedFrameBuffer().
 */

import * as flatbuffers from 'flatbuffers';
import { Frame } from '../../generated/telemetry/frame';
import type { Vec3 as FbVec3 } from '../../generated/telemetry/vec3';
import type {
  CanBusMessage,
  DamperPositionData,
  GpsData,
  ImuData,
  TelemetryFrame,
  Timestamp,
  Vec3,
  WheelSpeedData,
} from '../types';

/** Size of the length prefix in bytes (uint32 little-endian). */
const SIZE_PREFIX_BYTES = 4;

/**
 * Parse a length-prefixed FlatBuffer binary buffer into TelemetryFrame[].
 *
 * @param buffer - Raw binary data containing concatenated size-prefixed Frames
 * @returns Array of parsed telemetry frames, in order
 * @throws Error if the binary data is malformed
 */
export function readFrames(buffer: ArrayBuffer): TelemetryFrame[] {
  const frames: TelemetryFrame[] = [];
  const view = new DataView(buffer);
  let offset = 0;

  while (offset < buffer.byteLength) {
    // Ensure we can read the size prefix
    if (offset + SIZE_PREFIX_BYTES > buffer.byteLength) {
      throw new Error(
        `Truncated size prefix at offset ${offset}: ` +
          `need ${SIZE_PREFIX_BYTES} bytes, ` +
          `have ${buffer.byteLength - offset}`,
      );
    }

    // Read 4-byte little-endian frame size
    const frameSize = view.getUint32(offset, true);

    // Validate frame size
    if (frameSize === 0) {
      throw new Error(`Zero-length frame at offset ${offset}`);
    }
    if (offset + SIZE_PREFIX_BYTES + frameSize > buffer.byteLength) {
      throw new Error(
        `Truncated frame at offset ${offset}: ` +
          `declared size ${frameSize}, ` +
          `available ${buffer.byteLength - offset - SIZE_PREFIX_BYTES}`,
      );
    }

    // Extract frame bytes (copy to ensure safe, isolated ByteBuffer)
    const frameBytes = new Uint8Array(
      buffer.slice(offset + SIZE_PREFIX_BYTES, offset + SIZE_PREFIX_BYTES + frameSize),
    );
    const bb = new flatbuffers.ByteBuffer(frameBytes);
    const fbFrame = Frame.getRootAsFrame(bb);

    frames.push(convertFrame(fbFrame));

    offset += SIZE_PREFIX_BYTES + frameSize;
  }

  return frames;
}

/**
 * Convert a FlatBuffer Frame to our internal TelemetryFrame.
 */
function convertFrame(fb: Frame): TelemetryFrame {
  const frame: TelemetryFrame = {
    timestamp: convertTimestamp(fb),
    clockNanos: convertClockNanos(fb),
    gps: convertGps(fb),
    imu: convertImu(fb),
    wheelSpeed: convertWheelSpeed(fb),
    damperPosition: convertDamperPosition(fb),
    canBus: convertCanBus(fb),
  };

  return frame;
}

function convertTimestamp(fb: Frame): Timestamp | undefined {
  const ts = fb.time();
  if (!ts) return undefined;
  return {
    seconds: Number(ts.seconds()),
    nanoseconds: Number(ts.nanoseconds()),
  };
}

function convertClockNanos(fb: Frame): number {
  const clocks = fb.clocks();
  if (!clocks) {
    // clocks is required in the schema, so this should not happen
    // with valid data. Return 0 as a safe fallback.
    return 0;
  }
  return Number(clocks.time());
}

function convertGps(fb: Frame): GpsData | undefined {
  const gps = fb.gpsFrame();
  if (!gps) return undefined;
  return {
    lat: gps.lat(),
    lng: gps.lng(),
    speed: gps.speed(),
    altitude: gps.altitude(),
    heading: gps.heading(),
  };
}

function convertVec3(v: FbVec3 | null): Vec3 | undefined {
  if (!v) return undefined;
  return { x: v.x(), y: v.y(), z: v.z() };
}

function convertImu(fb: Frame): ImuData | undefined {
  const imu = fb.imuFrame();
  if (!imu) return undefined;

  const acceleration = convertVec3(imu.acceleration());
  const angularVelocity = convertVec3(imu.angularVelocity());
  // Note: schema has typo "magnemometer", our type uses "magnetometer"
  const magnetometer = convertVec3(imu.magnemometer());

  if (!acceleration || !angularVelocity || !magnetometer) return undefined;

  return { acceleration, angularVelocity, magnetometer };
}

function convertWheelSpeed(fb: Frame): WheelSpeedData | undefined {
  const ws = fb.wheelFrame();
  if (!ws) return undefined;
  return {
    frontLeft: ws.frontLeft(),
    frontRight: ws.frontRight(),
    backLeft: ws.backLeft(),
    backRight: ws.backRight(),
  };
}

function convertDamperPosition(fb: Frame): DamperPositionData | undefined {
  const dp = fb.damperFrame();
  if (!dp) return undefined;
  return {
    frontLeft: dp.frontLeft(),
    frontRight: dp.frontRight(),
    backLeft: dp.backLeft(),
    backRight: dp.backRight(),
  };
}

function convertCanBus(fb: Frame): readonly CanBusMessage[] | undefined {
  const len = fb.canBusLength();
  if (len === 0) return undefined;

  const messages: CanBusMessage[] = [];
  for (let i = 0; i < len; i++) {
    const msg = fb.canBus(i);
    if (!msg) continue;

    const data: number[] = [];
    const dataLen = msg.dataLen();
    for (let j = 0; j < dataLen && j < 8; j++) {
      data.push(msg.data(j) ?? 0);
    }

    messages.push({
      id: msg.id(),
      rtr: msg.rtr(),
      dataLen,
      data,
    });
  }

  return messages;
}
