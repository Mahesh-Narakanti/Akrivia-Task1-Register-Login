const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const knex = require("./objection");
const User = require("./models/User");
const Address = require("./models/Address");
const Language = require("./models/Language");

const app = express();
app.use(cors());
app.use(express.json());

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    jwt.verify(token, "godisgreat", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token expired or invalid" });
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};

app.get("/error", (req, res) => {
  throw new Error("This is an intentional error");
});

app.post("/register", async (req, res) => {
  const { name, email, password, addresses, languages, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.query().insert({
      name,
      email,
      password: hashedPassword,
      type,
    });

    const newAddresses = await Address.query().insertGraph(
      addresses.map((address) => ({
        ...address,
        user_id: newUser.id,
      }))
    );

    const newLanguages = await Language.query().insertGraph(
      languages.map((language) => ({
        ...language,
        city: newAddresses[0].city,
      }))
    );

    // Send success response
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.post("/login", async (req, res) => {
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
    if (user.type != type) {
      if (type == "admin") return res.status(404).send("Admin not found");
      else return res.status(404).send("User not found");
    }

    const token = jwt.sign({ id: user.id }, "godisgreat", { expiresIn: "1h" }); // Set token expiry to 1 hour

    res.status(200).send({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.get("/user-details", async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from "Authorization: Bearer token" header

  if (!token) {
    return res.status(403).send("Token Required");
  }

  try {
    // Decode and verify the JWT token
    const decoded = jwt.verify(token, "godisgreat");
    const uid = decoded.id;

    const user = await User.query()
      .findById(uid)
      .withGraphFetched("addresses.languages"); // Fetch languages through addresses

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      username: user.name,
      email: user.email,
      addresses: user.addresses,
      type: user.type,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.put("/update-user", async (req, res, next) => {
  const { id, name, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.query().findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await User.query()
      .patch({
        name,
        email,
        password: hashedPassword,
      })
      .where("id", id);

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.get("/allUsers", async (req, res) => {
  try {
    const users = await User.query().select("*");

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

app.get("/api/protected-data", validateToken, (req, res) => {
  res.json({ message: "This is protected data, token is valid." });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong, please try again later.",
    error: err.stack,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
