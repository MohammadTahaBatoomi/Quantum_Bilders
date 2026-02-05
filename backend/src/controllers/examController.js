"use strict";

const { createExam, getExamById, listExamsByUser } = require("../services/examService");

const create = async (req, res) => {
  const exam = await createExam(req.body);
  res.status(201).json({ success: true, data: exam });
};

const getById = async (req, res) => {
  const exam = await getExamById(req.params.id);
  res.status(200).json({ success: true, data: exam });
};

const listByUser = async (req, res) => {
  const exams = await listExamsByUser(req.params.userId);
  res.status(200).json({ success: true, data: exams });
};

module.exports = {
  create,
  getById,
  listByUser,
};
