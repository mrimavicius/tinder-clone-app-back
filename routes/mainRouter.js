const express = require("express")
const router = express.Router()

const { create_user, log_user, add_photo, get_user, add_like, autologin, logout, filter } = require("../controllers/mainController")
const { validateRegistration } = require("../modules/registrationValidator")

router.post("/create_user", validateRegistration, create_user)
router.post("/log_user", log_user)
router.post("/add_photo", add_photo)
router.post("/get_user", get_user)
router.post("/add_like", add_like)
router.get("/autologin", autologin)
router.get("/logout", logout)
router.post("/filter", filter)

module.exports = router