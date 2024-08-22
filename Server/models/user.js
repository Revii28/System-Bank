const { ApolloError } = require('apollo-server-express');
const { hashPassword, comparePassword, generateToken } = require('../helpers/auth');
const { ObjectId } = require('mongodb');
const { z } = require('zod');
const { DB } = require('../config/db.js');

class User {
  static userSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(5, "Password must be at least 5 characters long"),
  });

  static async create({ username, password }) {
    try {
      const validationResult = User.userSchema.safeParse({ username, password });
      if (!validationResult.success) {
        throw new ApolloError(validationResult.error.errors[0].message, 'VALIDATION_ERROR');
      }

      const userCollection = DB.collection('users');
      const existingUsername = await userCollection.findOne({ username });
      if (existingUsername) {
        throw new ApolloError('Username already exists', 'DUPLICATE_USERNAME');
      }

      const hashedPassword = await hashPassword(password);
      const result = await userCollection.insertOne({
        username,
        password: hashedPassword,
      });

      return await userCollection.findOne({ _id: result.insertedId });
    } catch (error) {
      throw new ApolloError(error.message || 'Error creating user', 'CREATE_ERROR');
    }
  }

  static async update(id, { username, password }) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new ApolloError('Invalid user ID', 'VALIDATION_ERROR');
      }

      const updateFields = {};
      if (username) updateFields.username = username;
      if (password) updateFields.password = await hashPassword(password);

      const userCollection = DB.collection('users');
      const result = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        throw new ApolloError('User not found', 'NOT_FOUND');
      }

      return result.value;
    } catch (error) {
      throw new ApolloError(error.message || 'Error updating user', 'UPDATE_ERROR');
    }
  }

  static async delete(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new ApolloError('Invalid user ID', 'VALIDATION_ERROR');
      }

      const userCollection = DB.collection('users');
      const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      throw new ApolloError(error.message || 'Error deleting user', 'DELETE_ERROR');
    }
  }

  static async login({ username, password }) {
    try {
      if (!username || !password) {
        throw new ApolloError('Username and password are required', 'VALIDATION_ERROR');
      }

      const userCollection = DB.collection('users');
      const user = await userCollection.findOne({ username });
      if (!user) {
        throw new ApolloError('Invalid username or password', 'AUTH_ERROR');
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new ApolloError('Invalid username or password', 'AUTH_ERROR');
      }

      const token = generateToken(user);
      return { token, user };
    } catch (error) {
      throw new ApolloError(error.message || 'Error logging in', 'LOGIN_ERROR');
    }
  }

  static async register({ username, password, role }) {
    try {
        const validationResult = User.userSchema.safeParse({ username, password });
        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors.length > 0 
                ? validationResult.error.errors[0].message 
                : 'Validation error';
            throw new ApolloError(errorMessage, 'VALIDATION_ERROR');
        }

        const validRoles = ['customer', 'admin'];
        if (role && !validRoles.includes(role)) {
            throw new ApolloError('Invalid role', 'VALIDATION_ERROR');
        }

        const hashedPassword = await hashPassword(password);

        const result = await DB.collection('users').insertOne({
            username,
            password: hashedPassword,
            role: role || 'customer'
        });

        const user = await DB.collection('users').findOne({ _id: result.insertedId });

        const token = generateToken(user);

        return { token, user };
    } catch (error) {
        throw new ApolloError(error.message || 'Error registering user', 'REGISTER_ERROR');
    }
}


  static async findUserById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new ApolloError('Invalid user ID', 'VALIDATION_ERROR');
      }

      const userCollection = DB.collection('users');
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        throw new ApolloError('User not found', 'NOT_FOUND');
      }
      return user;
    } catch (error) {
      throw new ApolloError(error.message || 'Error finding user', 'FIND_ERROR');
    }
  }
}

module.exports = User;
