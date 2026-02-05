"use strict";

const { randomUUID } = require("crypto");
const { updateWithLock, readWithLock } = require("../data/db");
const { AppError } = require("../utils/AppError");

const PASS_RATE = 0.6;

const normalizeChoice = (item) => {
  if (typeof item === "string") return item.trim();
  if (item && typeof item === "object") {
    if (typeof item.choice === "string") return item.choice.trim();
    if (typeof item.answer === "string") return item.answer.trim();
    if (typeof item.selected === "string") return item.selected.trim();
  }
  return null;
};

const isCorrectModeAnswer = (item) => {
  if (typeof item === "boolean") return true;
  if (item && typeof item === "object" && typeof item.correct === "boolean") return true;
  return false;
};

const validateAnswers = (answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new AppError("answers must be a non-empty array", 400, "VALIDATION_ERROR", {
      field: "answers",
    });
  }

  const hasCorrectMode = answers.every(isCorrectModeAnswer);
  const hasChoiceMode = answers.every((item) => Boolean(normalizeChoice(item)));

  if (!hasCorrectMode && !hasChoiceMode) {
    throw new AppError("answers format is invalid", 400, "VALIDATION_ERROR", {
      field: "answers",
    });
  }
};

const validateDraftAnswers = (answers) => {
  if (!Array.isArray(answers)) {
    throw new AppError("answers must be an array", 400, "VALIDATION_ERROR", {
      field: "answers",
    });
  }
};

const scoreAnswers = (answers) => {
  let correct = 0;
  for (const item of answers) {
    if (typeof item === "boolean") {
      if (item) correct += 1;
      continue;
    }
    if (item && typeof item === "object" && item.correct === true) {
      correct += 1;
    }
  }
  return correct;
};

const createExam = async ({ userId, answers, categoryKey }) => {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new AppError("userId is required", 400, "VALIDATION_ERROR", { field: "userId" });
  }

  validateAnswers(answers);
  const usesCorrectMode = answers.every(isCorrectModeAnswer);

  return updateWithLock(async (db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", { userId });
    }

    const total = answers.length;
    let score = 0;
    let result = "failed";
    let analysis = { mode: "correct" };

    if (usesCorrectMode) {
      score = scoreAnswers(answers);
      const passScore = Math.ceil(total * PASS_RATE);
      result = score >= passScore ? "passed" : "failed";
    } else {
      const counts = answers.reduce((acc, item) => {
        const key = normalizeChoice(item);
        if (!key) return acc;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const topChoice = sorted.length > 0 ? sorted[0][0] : null;
      score = topChoice ? counts[topChoice] : 0;
      result = topChoice || "unknown";
      analysis = {
        mode: "choice",
        topChoice,
        counts,
      };
    }

    const exam = {
      id: randomUUID(),
      userId,
      answers,
      score,
      total,
      result,
      analysis,
      categoryKey: typeof categoryKey === "string" ? categoryKey : null,
      createdAt: new Date().toISOString(),
    };

    db.exams.push(exam);
    const drafts = db.drafts.filter((d) => d.userId !== userId);
    return { ...db, exams: db.exams, drafts };
  }).then((db) => db.exams[db.exams.length - 1]);
};

const getExamById = async (id) => {
  const db = await readWithLock();
  const exam = db.exams.find((e) => e.id === id);
  if (!exam) {
    throw new AppError("Exam not found", 404, "EXAM_NOT_FOUND", { id });
  }
  return exam;
};

const listExamsByUser = async (userId) => {
  const db = await readWithLock();
  return db.exams.filter((e) => e.userId === userId);
};

const saveDraft = async ({ userId, answers, categoryKey, progressIndex, total }) => {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new AppError("userId is required", 400, "VALIDATION_ERROR", { field: "userId" });
  }
  validateDraftAnswers(answers);

  return updateWithLock(async (db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", { userId });
    }

    const existingIndex = db.drafts.findIndex((d) => d.userId === userId);
    const now = new Date().toISOString();
    const draft = {
      id: existingIndex >= 0 ? db.drafts[existingIndex].id : randomUUID(),
      userId,
      answers,
      categoryKey: typeof categoryKey === "string" ? categoryKey : null,
      progressIndex: Number.isInteger(progressIndex) ? progressIndex : null,
      total: Number.isInteger(total) ? total : null,
      updatedAt: now,
      createdAt: existingIndex >= 0 ? db.drafts[existingIndex].createdAt : now,
    };

    if (existingIndex >= 0) {
      db.drafts[existingIndex] = draft;
    } else {
      db.drafts.push(draft);
    }

    return { ...db, drafts: db.drafts };
  }).then((db) => db.drafts.find((d) => d.userId === userId));
};

const getDraftByUser = async (userId) => {
  const db = await readWithLock();
  return db.drafts.find((d) => d.userId === userId) || null;
};

const clearDraftByUser = async (userId) =>
  updateWithLock(async (db) => {
    const drafts = db.drafts.filter((d) => d.userId !== userId);
    return { ...db, drafts };
  }).then(() => ({ success: true }));

module.exports = {
  createExam,
  getExamById,
  listExamsByUser,
  saveDraft,
  getDraftByUser,
  clearDraftByUser,
};
