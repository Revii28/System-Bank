const { DB } = require('../config/db');
const { GraphQLError } = require('graphql');
const { ObjectId } = require('mongodb');

class DepositoType {
  static async create({ name, yearlyReturn }) {
    const depositoTypeCollection = DB.collection('depositoTypes');

    const result = await depositoTypeCollection.insertOne({
      name,
      yearlyReturn,
    });

    return await depositoTypeCollection.findOne({ _id: result.insertedId });
  }

  static async update(id, { name, yearlyReturn }) {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (yearlyReturn !== undefined) updateFields.yearlyReturn = yearlyReturn;

    const depositoTypeCollection = DB.collection('depositoTypes');

    const result = await depositoTypeCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnOriginal: false }
    );

    if (!result.value) {
      throw new GraphQLError("DepositoType not found");
    }

    return result.value;
  }

  static async delete(id) {
    const depositoTypeCollection = DB.collection('depositoTypes');

    const result = await depositoTypeCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async findById(id) {
    const depositoTypeCollection = DB.collection('depositoTypes');
    const depositoType = await depositoTypeCollection.findOne({ _id: new ObjectId(id) });
    if (!depositoType) {
      throw new GraphQLError("DepositoType not found");
    }
    return depositoType;
  }
}

module.exports = DepositoType;
