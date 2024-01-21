"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import express, { type Response } from 'express'
// import express from 'express'
const otp_1 = require("../controller/otp");
const router = express_1.default.Router();
router.post('/sendStudent-otp', otp_1.sendStudentOTP);
router.post('/verifyStudent-otp', otp_1.verifyStudentOTP);
router.post('/sendLecturer-otp', otp_1.sendLecturerOTP);
router.post('/verifyLecturer-otp', otp_1.verifyLecturerOTP);
exports.default = router;
