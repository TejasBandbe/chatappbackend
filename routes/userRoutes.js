const { register, login, setAvatar, getAllUsers,
updateName, updateEmail, updatePassword, deleteUser, getUser } = require("../controllers/usersController");


const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.put("/updatename/:id", updateName);
router.put("/updateemail/:id", updateEmail);
router.put("/updatepassword/:id", updatePassword);
router.delete("/deleteuser/:id", deleteUser);
router.get("/getuser/:id", getUser);

module.exports = router;