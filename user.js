const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload_file");

const {
    getUserById,
    getAllUserByRole,
    postTryRsp,
    postUser,
    deleteUser,
    loginHandler,
    getUserByToken,
    editUserAccount
} = require("../controller/user");

//GET USER BY ID
router.get("/users/fetch-all", getUserById);

//GET USER BY ROLE
router.get("/users/:userRole", getAllUserByRole);

//Register new User
router.post("/users/register-rsp", postTryRsp);

//Login user
router.post("/users/login", loginHandler);

//DELETE /users/:userId
router.delete("/users/:userId", deleteUser);

//GET USER DATA BY TOKEN
router.get("/users/fetch-by-token", getUserByToken);

// PUT /user/edit-account
router.put("/users/edit-account", upload.single("image"), editUserAccount);

module.exports = router;
