const { DB } = require('../config/db');
const { hashPassword, checkPassword } = require('../helpers/auth.js');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { z } = require("zod");

class User {
  static userSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(5, "Password must be at least 5 characters long"),
    role: z.string().optional(),
  });

  static async create({ username, password, role }) {
    const validationResult = User.userSchema.safeParse({ username, password, role });
    if (!validationResult.success) {
      throw new GraphQLError(validationResult.error.errors[0].message);
    }

    const userCollection = DB.collection('users');

    const existingUsername = await userCollection.findOne({ username });
    if (existingUsername) {
      throw new GraphQLError("Username already exists");
    }

    password = await hashPassword(password);

    let result = await userCollection.insertOne({
      username,
      password,
      role: role || "customer",
    });

    return await userCollection.findOne({ _id: result.insertedId });
  }

  static async update(id, { username, password, role }) {
    const updateFields = {};
    if (username) updateFields.username = username;
    if (password) updateFields.password = await hashPassword(password);
    if (role) updateFields.role = role;

    const userCollection = DB.collection('users');

    const result = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnOriginal: false }
    );

    if (!result.value) {
      throw new GraphQLError("User not found");
    }

    return result.value;
  }

  static async delete(id) {
    const userCollection = DB.collection('users');

    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async login({ username, password }) {
    if (!username) {
      throw new GraphQLError("Username is required");
    }
    if (!password) {
      throw new GraphQLError("Password is required");
    }

    const userCollection = DB.collection('users');

    let user = await userCollection.findOne({ username });
    if (!user) {
      throw new GraphQLError("Invalid Username/Password");
    }
    if (!await checkPassword(password, user.password)) {
      throw new GraphQLError("Invalid Username/Password");
    }

    let token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { access_token: token, id: user._id, role: user.role };
  }

  static async findUserById(id) {
    const userCollection = DB.collection('users');
    let user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new GraphQLError("User not found");
    }
    return user;
  }
}

module.exports = User;
