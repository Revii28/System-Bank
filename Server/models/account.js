const { DB } = require('../config/db');
const { GraphQLError } = require('graphql');
const { ObjectId } = require('mongodb');

class Account {
  static async create({ packet, customerId, balance, depositoTypeId }) {
    const accountCollection = DB.collection('accounts');

    const result = await accountCollection.insertOne({
      packet,
      customer: new ObjectId(customerId),
      balance: balance || 0,
      depositoType: new ObjectId(depositoTypeId),
    });

    return await accountCollection.findOne({ _id: result.insertedId });
  }

  static async update(id, { packet, balance, depositoTypeId }) {
    const updateFields = {};
    if (packet) updateFields.packet = packet;
    if (balance !== undefined) updateFields.balance = balance;
    if (depositoTypeId) updateFields.depositoType = new ObjectId(depositoTypeId);

    const accountCollection = DB.collection('accounts');

    const result = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnOriginal: false }
    );

    if (!result.value) {
      throw new GraphQLError("Account not found");
    }

    return result.value;
  }

  static async delete(id) {
    const accountCollection = DB.collection('accounts');

    const result = await accountCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async findById(id) {
    const accountCollection = DB.collection('accounts');
    const account = await accountCollection.findOne({ _id: new ObjectId(id) });
    if (!account) {
      throw new GraphQLError("Account not found");
    }
    return account;
  }
}

module.exports = Account;
