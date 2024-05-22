const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload_file");

const {
    getUserById,
    getAllUserByRole,
    postRsp,
    postPasien,
    postDokter,
    deleteUser,
    loginHandler,
    getUserByToken,
    editUserAccount
} = require("../controller/user");

//GET USER BY ID
router.get("/users/:userId", getUserById);

//GET USER BY ROLE
router.get("/users/:userRole", getAllUserByRole);

//REGISTER NEW RESEPSIONIS
router.post("/users/register/resepsionis", postRsp);

//REGISTER NEW PASIEN
router.post("/users/register/pasien", postPasien);

//REGISTER NEW DOKTER
router.post("/users/register/dokter", postDokter);

//USER LOGIN
router.post("/users/login", loginHandler);

//DELETE USER ACCOUNT
router.delete("/users/:userId", deleteUser);

//GET USER DATA BY TOKEN
router.get("/users/fetch-by-token", getUserByToken);

//EDIT ACCOUNT DETAILS
router.put("/users/edit-account", upload.single("profilePict"), editUserAccount);

module.exports = router;
