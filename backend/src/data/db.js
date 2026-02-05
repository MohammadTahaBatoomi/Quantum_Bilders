"use strict";

const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "db.json");
const DEFAULT_DB = { users: [], exams: [] };

let lastOp = Promise.resolve();
const withLock = async (fn) => {
  const run = () => fn();
  const current = lastOp.then(run, run);
  lastOp = current.then(
    () => undefined,
    () => undefined
  );
  return current;
};

const ensureDbFile = async () => {
  try {
    await fsp.access(DB_PATH, fs.constants.F_OK);
  } catch (_) {
    await writeDb(DEFAULT_DB);
  }
};

const readDb = async () => {
  await ensureDbFile();
  const raw = await fsp.readFile(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
    };
  } catch (_) {
    return { ...DEFAULT_DB };
  }
};

const writeDb = async (data) => {
  const tempPath = `${DB_PATH}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  await fsp.writeFile(tempPath, payload, "utf-8");
  await fsp.rename(tempPath, DB_PATH);
};

const readWithLock = async () => withLock(() => readDb());

const writeWithLock = async (data) => withLock(() => writeDb(data));

const updateWithLock = async (updater) =>
  withLock(async () => {
    const db = await readDb();
    const updated = await updater(db);
    await writeDb(updated);
    return updated;
  });

module.exports = {
  readWithLock,
  writeWithLock,
  updateWithLock,
};
