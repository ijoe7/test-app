const AppError = require("../config/appError");
const User = require("../models/user");
const helper = require("../config/helper");

exports.addUser = async (req, res, next) => {
  try {
    let request = ["username", "firstName", "lastName", "password", "address"];
    const data = helper.validateParams(req, next, request);
    const user = await User.create(data);
    res.status(201).json({
      status: "success",
      message: "User created",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Id is required"));
    const user = await User.findById(id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({
      status: "success",
      message: "User found",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return next(new AppError("Id is required"));
        const user = await User.findById(id).select("+password");
        if (!user) return next(new AppError("User not found", 404));
        console.log(user);
        const data = {
            username: req.body.username || user.username,
            firstName: req.body.firstName || user.firstName,
            lastName: req.body.lastName || user.lastName,
            password: req.body.password || user.password,
            address: req.body.address || user.address,
        };
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({
            status: "success",
            message: "User updated",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return next(new AppError("Id is required"));
        const user = await User.findById(id);
        if (!user) return next(new AppError("User not found", 404));
        await User.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "User deleted",
        });
    } catch (error) {
        next(error);
    }
};
