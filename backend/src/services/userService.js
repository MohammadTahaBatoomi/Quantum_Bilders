"use strict";

const { randomUUID } = require("crypto");
const { updateWithLock, readWithLock } = require("../data/db");
const { AppError } = require("../utils/AppError");

const normalizePhone = (phone) => phone.replace(/\s+/g, "").trim();

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
      throw new AppError("Phone number already registered", 409, "PHONE_EXISTS", {
        phone: normalizedPhone,
      });
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
  }).then((db) => db.users[db.users.length - 1]);
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

module.exports = {
  registerUser,
  getUserById,
  listUsers,
};
