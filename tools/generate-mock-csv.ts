/**
 * Generates mock telemetry data as CSV.
 * Output: public/data/telemetry.csv
 *
 * Usage: pnpm run generate:mock-csv
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { generateAllRows, CSV_HEADERS, FRAME_COUNT, SAMPLE_RATE_HZ } from './mock-data.js';

const OUTPUT_PATH = path.join('public', 'data', 'telemetry.csv');

function main() {
  const rows = generateAllRows();

  const lines: string[] = [CSV_HEADERS.join(',')];

  for (const row of rows) {
    const values = CSV_HEADERS.map((key) => row[key]);
    lines.push(values.join(','));
  }

  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'));

  console.log(`Generated ${FRAME_COUNT} rows -> ${OUTPUT_PATH}`);
  console.log(`Duration: ${(FRAME_COUNT / SAMPLE_RATE_HZ).toFixed(1)}s at ${SAMPLE_RATE_HZ} Hz`);
}

main();
