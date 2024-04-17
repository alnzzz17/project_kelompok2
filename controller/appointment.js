require("dotenv").config();
const Appointment = require("../model/Appointment");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;
const fs = require("fs");

const getAllAppoint = async (req,res,next) => {

}

const addAppoint = async (req,res,next) => {

}

const deleteAppoint = async (req,res,next) => {

}

const editAppointDetail = async (req,res,next) => {

}

const getAppointById = async (req,res,next) => {

}

const getAppointByUser = async (req,res,next) => {

}

module.exports = {
    getAllAppoint,
    addAppoint,
    deleteAppoint,
    editAppointDetail,
    getAppointById,
    getAppointByUser
  };