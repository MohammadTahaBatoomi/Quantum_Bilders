"use strict";

const { randomUUID } = require("crypto");
const { updateWithLock, readWithLock } = require("../data/db");
const { AppError } = require("../utils/AppError");

const normalizePhone = (phone) => {
  const raw = String(phone ?? "").trim();
  // فقط ارقام را نگه می‌داریم
  const digits = raw.replace(/\D+/g, "");

  // 0098xxxxxxxxxx یا 98xxxxxxxxxx → 0xxxxxxxxxx
  if (digits.startsWith("0098") && digits.length >= 14) {
    return `0${digits.slice(4)}`;
  }
  if (digits.startsWith("98") && digits.length >= 12) {
    return `0${digits.slice(2)}`;
  }

  // اگر با 0 شروع شود همان را برمی‌گردانیم
  if (digits.startsWith("0")) {
    return digits;
  }

  return digits;
};

const validateString = (value, field) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`${field} is required`, 400, "VALIDATION_ERROR", { field });
  }
};

const registerUser = async ({ fullName, fieldOfStudy, phone }) => {
  validateString(fullName, "fullName");
  validateString(fieldOfStudy, "fieldOfStudy");
  validateString(phone, "phone");

  const normalizedPhone = normalizePhone(phone);

  return updateWithLock(async (db) => {
    const existing = db.users.find((u) => normalizePhone(u.phone) === normalizedPhone);
    if (existing) {
      // Treat repeated registration as login
      return db;
    }

    const user = {
      id: randomUUID(),
      fullName: fullName.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      phone: normalizedPhone,
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    return { ...db, users: db.users };
  }).then((db) => {
    const existing = db.users.find((u) => normalizePhone(u.phone) === normalizedPhone);
    return existing || db.users[db.users.length - 1];
  });
};

const getUserById = async (id) => {
  const db = await readWithLock();
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND", { id });
  }
  return user;
};

const listUsers = async () => {
  const db = await readWithLock();
  return db.users;
};

const getUserByPhone = async (phone) => {
  validateString(phone, "phone");
  const normalizedPhone = normalizePhone(phone);
  const db = await readWithLock();
  const user = db.users.find((u) => normalizePhone(u.phone) === normalizedPhone);
  return user || null;
};

module.exports = {
  registerUser,
  getUserById,
  listUsers,
  getUserByPhone,
};
