"use strict";

const { registerUser, getUserById, listUsers } = require("../services/userService");

const register = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ success: true, data: user });
};

const getById = async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
};

const list = async (req, res) => {
  const users = await listUsers();
  res.status(200).json({ success: true, data: users });
};

module.exports = {
  register,
  getById,
  list,
};
