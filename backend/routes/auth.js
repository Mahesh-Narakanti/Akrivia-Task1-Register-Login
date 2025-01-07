const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Address = require("../models/Address");
const Language = require("../models/Language");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { name, email, password, addresses, languages, type ,profilePicture } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.query().insert({
      name,
      email,
      password: hashedPassword,
      type,
      profilePicture
    });

    await Address.query().insertGraph(
      addresses.map((address) => ({
        ...address,
        user_id: newUser.id,
      }))
    );

    await Language.query().insertGraph(
      languages.map((language) => ({
        ...language,
        city: addresses[0].city,
      }))
    );

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { name, password, type } = req.body;

  try {
    const user = await User.query().findOne({ name });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send("Invalid credentials");
    }

    if (user.type !== type) {
      return res
        .status(404)
        .send(type === "admin" ? "Admin not found" : "User not found");
    }

    const token = jwt.sign({ id: user.id }, "godisgreat", { expiresIn: "1h" });

    res.status(200).send({
      message: "Login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
