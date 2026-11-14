// ABOUTME: Test data readers for CSV, Excel, and JSON files.
// ABOUTME: All paths resolve relative to the project's test-data/ directory.
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { dataLogger } from '../utils/logger';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsvRow = Record<string, string>;
export type ExcelRow = Record<string, string | number | boolean | null>;

// ─── Path Helper ──────────────────────────────────────────────────────────────

// data-reader.ts lives at src/main/shared/data/ — four levels below project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

function resolveDataPath(filePath: string): string {
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(PROJECT_ROOT, 'test-data', filePath);
}

// ─── CSV Reader ───────────────────────────────────────────────────────────────

export function readCsv<T extends CsvRow = CsvRow>(
  filePath: string,
  options: {
    delimiter?: string;
    skipEmptyLines?: boolean;
    trimValues?: boolean;
  } = {}
): T[] {
  const resolved = resolveDataPath(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`CSV file not found: ${resolved}`);
  }

  const { delimiter = ',', skipEmptyLines = true, trimValues = true } = options;

  const content = fs.readFileSync(resolved, 'utf-8');

  const rows = parse(content, {
    columns: true,
    delimiter,
    skip_empty_lines: skipEmptyLines,
    trim: trimValues,
    cast: false,
  }) as T[];

  dataLogger.info(`CSV loaded: ${path.basename(filePath)} (${rows.length} rows)`);
  return rows;
}

// ─── Excel Reader ─────────────────────────────────────────────────────────────

export function readExcel<T extends ExcelRow = ExcelRow>(
  filePath: string,
  sheetName?: string | number
): T[] {
  const resolved = resolveDataPath(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Excel file not found: ${resolved}`);
  }

  const workbook = XLSX.readFile(resolved);

  const sheet = sheetName !== undefined
    ? typeof sheetName === 'number'
      ? workbook.Sheets[workbook.SheetNames[sheetName]]
      : workbook.Sheets[sheetName]
    : workbook.Sheets[workbook.SheetNames[0]];

  const targetSheet = sheetName !== undefined
    ? (typeof sheetName === 'string' ? sheetName : workbook.SheetNames[sheetName])
    : workbook.SheetNames[0];

  if (!sheet) {
    throw new Error(
      `Sheet "${targetSheet}" not found in ${path.basename(filePath)}. ` +
      `Available sheets: ${workbook.SheetNames.join(', ')}`
    );
  }

  const rows = XLSX.utils.sheet_to_json<T>(sheet, {
    defval: null,
    raw: false,
  });

  dataLogger.info(
    `Excel loaded: ${path.basename(filePath)} → sheet "${targetSheet}" (${rows.length} rows)`
  );

  return rows;
}

// ─── JSON Reader ──────────────────────────────────────────────────────────────

export function readJson<T = unknown>(filePath: string): T {
  const resolved = resolveDataPath(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`JSON file not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, 'utf-8');

  try {
    const data = JSON.parse(content) as T;
    dataLogger.info(`JSON loaded: ${path.basename(filePath)}`);
    return data;
  } catch (err) {
    throw new Error(`Invalid JSON in ${resolved}: ${String(err)}`);
  }
}

// ─── Sheet Inspector ──────────────────────────────────────────────────────────

export function getExcelSheetNames(filePath: string): string[] {
  const resolved = resolveDataPath(filePath);
  const workbook = XLSX.readFile(resolved);
  return workbook.SheetNames;
}
