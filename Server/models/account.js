const { DB } = require('../config/db');
const { GraphQLError } = require('graphql');
const { ObjectId } = require('mongodb');

class Account {
  static async create({ packet, customerId, balance = 0, depositoTypeId }) {
    if (!packet || !ObjectId.isValid(customerId) || !ObjectId.isValid(depositoTypeId)) {
      throw new GraphQLError('Invalid input data');
    }
    if (balance < 0) {
      throw new GraphQLError('Balance must be a non-negative number');
    }

    const accountCollection = DB.collection('accounts');
    const result = await accountCollection.insertOne({
      packet,
      customer: new ObjectId(customerId),
      balance,
      depositoType: new ObjectId(depositoTypeId),
    });

    return await this.findById(result.insertedId);
  }

  static async update(id, { packet, balance, depositoTypeId }) {
    if (!ObjectId.isValid(id)) {
      throw new GraphQLError('Invalid account ID');
    }

    const updateFields = {};
    if (packet) updateFields.packet = packet;
    if (balance !== undefined) {
      if (balance < 0) {
        throw new GraphQLError('Balance must be a non-negative number');
      }
      updateFields.balance = balance;
    }
    if (depositoTypeId) {
      if (!ObjectId.isValid(depositoTypeId)) {
        throw new GraphQLError('Invalid depositoType ID');
      }
      updateFields.depositoType = new ObjectId(depositoTypeId);
    }

    const accountCollection = DB.collection('accounts');
    const result = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new GraphQLError('Account not found');
    }

    return await this.findById(id);
  }

  static async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new GraphQLError('Invalid account ID');
    }

    const accountCollection = DB.collection('accounts');
    const result = await accountCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new GraphQLError('Invalid account ID');
    }

    const accountCollection = DB.collection('accounts');
    const account = await accountCollection.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'depositoTypes',
          localField: 'depositoType',
          foreignField: '_id',
          as: 'depositoType'
        }
      },
      {
        $unwind: {
          path: '$depositoType',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    if (!account.length) {
      throw new GraphQLError('Account not found');
    }

    return account[0];
  }

  static async depositAmount(id, amount) {
    if (!ObjectId.isValid(id) || amount <= 0) {
      throw new GraphQLError('Invalid input data');
    }

    const accountCollection = DB.collection('accounts');
    const result = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { balance: amount } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new GraphQLError('Account not found');
    }

    return await this.findById(id);
  }

  static async withdrawAmount(id, amount) {
    if (!ObjectId.isValid(id) || amount <= 0) {
      throw new GraphQLError('Invalid input data');
    }

    const accountCollection = DB.collection('accounts');
    const result = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId(id), balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new GraphQLError('Insufficient balance or account not found');
    }

    return await this.findById(id);
  }
}

module.exports = Account;
