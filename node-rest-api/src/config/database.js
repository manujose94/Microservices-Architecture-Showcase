// src/config/database.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../domain/models/user.model");

mongoose.Promise = global.Promise;


async function connectToDatabase(retries = 5, interval = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(process.env.MONGODB_URI)
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to database");

      if (process.env.NODE_ENV === "development") {
        // Insert some test users
        const users = [
          {
            username: "user1",
            name: "Jhon",
            email: "user1@example.com",
            password: bcrypt.hashSync("password1", 10),
          },
          {
            username: "user2",
            name: "Jhonna",
            email: "user2@example.com",
            password: bcrypt.hashSync("password2", 10),
          },
          {
            username: "user3",
            name: "Alex",
            email: "user3@example.com",
            password: bcrypt.hashSync("password3", 10),
          },
        ];
        try {
          await User.insertMany(users);
          console.log("Inserted test users");
        } catch (err) {
          console.log("Not Inserted test users");
        }
      }
      return true;
    } catch (err) {
      console.error(
        `Failed to connect to database: attempt ${i + 1} of ${retries}`
      );
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  console.error(`Failed to connect to database after ${retries} attempts`);
  return false;
}

const createAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("Admin user already exists");
    return;
  }

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    role: "admin",
  });
  await user.save();
  const userId = user.id;
  console.log(`Admin user created with ID ${userId}`);
};


async function initialize() {
  const connected = await connectToDatabase();
  if (connected) {
    await createAdminUser();
  } else {
    console.log("Database connection failed; skipping admin user creation.");
  }
}


module.exports = {
  connectToDatabase,
  createAdminUser,
  initialize
};
