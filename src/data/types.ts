/**
 * Core telemetry data model.
 *
 * These types are the app's internal representation, decoupled from
 * FlatBuffer generated code. The fb-reader layer converts between them.
 *
 * Field naming follows the FlatBuffer schema (telemetry.fbs) with
 * camelCase convention. The schema typo "magnemometer" is corrected
 * to "magnetometer" here; the conversion layer handles the mapping.
 */

// ---- Primitives ----

export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
}

// ---- Sensor data per frame ----

export interface GpsData {
  readonly lat: number;
  readonly lng: number;
  readonly speed: number;
  readonly altitude: number;
  readonly heading: number;
}

export interface ImuData {
  readonly acceleration: Vec3;
  readonly angularVelocity: Vec3;
  readonly magnetometer: Vec3;
}

export interface WheelSpeedData {
  readonly frontLeft: number;
  readonly frontRight: number;
  readonly backLeft: number;
  readonly backRight: number;
}

export interface DamperPositionData {
  readonly frontLeft: number;
  readonly frontRight: number;
  readonly backLeft: number;
  readonly backRight: number;
}

export interface CanBusMessage {
  readonly id: number;
  readonly rtr: boolean;
  readonly dataLen: number;
  readonly data: readonly number[];
}

// ---- Single telemetry frame ----

export interface TelemetryFrame {
  /** Wall-clock time. Optional because the schema does not mark it required. */
  readonly timestamp?: Timestamp;
  /** Monotonic clock in nanoseconds. Always present (required in schema). */
  readonly clockNanos: number;
  readonly gps?: GpsData;
  readonly imu?: ImuData;
  readonly wheelSpeed?: WheelSpeedData;
  readonly damperPosition?: DamperPositionData;
  readonly canBus?: readonly CanBusMessage[];
}

// ---- Store: collection of frames + metadata ----

export type TelemetryChannel =
  | 'gps'
  | 'imu'
  | 'wheelSpeed'
  | 'damperPosition'
  | 'canBus';

export interface TelemetryMetadata {
  readonly sourceName: string;
  readonly frameCount: number;
  readonly durationSeconds: number;
  readonly availableChannels: readonly TelemetryChannel[];
}

export interface TelemetryStore {
  readonly frames: readonly TelemetryFrame[];
  readonly metadata: TelemetryMetadata;
}
