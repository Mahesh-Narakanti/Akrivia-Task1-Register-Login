const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/user-details", async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token Required");
  }

  try {
    const decoded = jwt.verify(token, "godisgreat");
    const user = await User.query()
      .findById(decoded.id)
      .withGraphFetched("addresses.languages");

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      id: user.id,
      username: user.name,
      email: user.email,
      addresses: user.addresses,
      type: user.type,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/update-user", async (req, res, next) => {
  const { id, name, email, password, profilePicture } = req.body;
  console.log(req.body);
  try {
    const user = await User.query().findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
   

    await User.query()
      .patch({
        name,
        email,
        password: hashedPassword,
        profilePicture,
      })
      .where("id", id);

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/delete-user", async (req, res, next) => {
  const { id } = req.body;
  console.log(id);
  try {
    
    await User.query().delete().where("id", id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.get("/allUsers", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const offset = (page - 1) * limit; // Calculate offset for pagination

    const users = await User.query().select("*").limit(limit).offset(offset);

    const totalUsers = await User.query().count("* as total"); // Get total count of users

    res.status(200).json({
      users,
      total: totalUsers[0].total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/allData", async (req, res, next) => {
  try {
    const users = await User.query().select("*");
    res.status(200).json(users);
  }
  catch (err) {
    next(err);
  }
})

module.exports = router;
