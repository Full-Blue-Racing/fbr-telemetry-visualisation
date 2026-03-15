import type { DataProvider, DataProviderResult } from '../provider';
import type { TelemetryChannel, TelemetryFrame } from '../types';
import { readFrames } from './fb-reader';

export class FlatBufferDataProvider implements DataProvider {
  readonly name = 'FlatBuffer Binary';

  async load(url: string): Promise<DataProviderResult> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          status: 'error',
          error: `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
        };
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength === 0) {
        return { status: 'error', error: 'Empty file' };
      }

      const frames = readFrames(buffer);
      if (frames.length === 0) {
        return { status: 'error', error: 'No frames found in file' };
      }

      const availableChannels = detectChannels(frames);
      const durationSeconds = computeDuration(frames);

      return {
        status: 'success',
        store: {
          frames,
          metadata: {
            sourceName: url,
            frameCount: frames.length,
            durationSeconds,
            availableChannels,
          },
        },
      };
    } catch (err) {
      return {
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

/**
 * Scan frames to determine which sensor channels have data.
 * Checks only the first frame for performance — assumes all frames
 * have the same channels populated.
 */
function detectChannels(frames: readonly TelemetryFrame[]): TelemetryChannel[] {
  const channels: TelemetryChannel[] = [];
  const first = frames[0];

  if (first.gps) channels.push('gps');
  if (first.imu) channels.push('imu');
  if (first.wheelSpeed) channels.push('wheelSpeed');
  if (first.damperPosition) channels.push('damperPosition');
  if (first.canBus) channels.push('canBus');

  return channels;
}

/**
 * Compute session duration in seconds from the first and last frame.
 * Uses clockNanos (monotonic) for accuracy.
 */
function computeDuration(frames: readonly TelemetryFrame[]): number {
  if (frames.length < 2) return 0;

  const first = frames[0].clockNanos;
  const last = frames[frames.length - 1].clockNanos;

  return (last - first) / 1_000_000_000;
}
