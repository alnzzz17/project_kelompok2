require("dotenv").config();
const Jadwal = require("../model/Jadwal");

const addJadwal = async (req, res, next) => {
  try {
    const { day, time } = req.body;
    const newJadwal = await Jadwal.create({ day, time });
    res.status(201).json({
      status: "Success",
      message: "Jadwal added successfully",
      jadwal: newJadwal,
    });
  } catch (error) {
    next(error);
  }
};

const editJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { day, time } = req.body;
    const jadwal = await Jadwal.findByPk(id);
    if (!jadwal) {
      throw new Error("Jadwal not found");
    }
    jadwal.day = day;
    jadwal.time = time;
    await jadwal.save();
    res.status(200).json({
      status: "Success",
      message: "Jadwal updated successfully",
      jadwal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJadwal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userRole = req.user.role;
    if (userRole !== "Admin" && userRole !== "Resepsionis") {
      throw new Error("Access denied");
    }

    const deletedJadwal = await Jadwal.destroy({ where: { idJadwal: id } });
    if (!deletedJadwal) {
      throw new Error("Jadwal not found");
    }
    res.status(200).json({
      status: "Success",
      message: "Jadwal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllJadwal = async (req, res, next) => {
  try {
    const jadwals = await Jadwal.findAll();
    res.status(200).json({
      status: "Success",
      message: "All jadwals retrieved successfully",
      jadwals,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addJadwal,
  editJadwal,
  deleteJadwal,
  getAllJadwal,
};
