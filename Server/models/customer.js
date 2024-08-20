const { DB } = require('../config/db');
const { GraphQLError } = require('graphql');
const { ObjectId } = require('mongodb');

class Customer {
  static async create({ name }) {
    const customerCollection = DB.collection('customers');

    const result = await customerCollection.insertOne({
      name,
    });

    return await customerCollection.findOne({ _id: result.insertedId });
  }

  static async update(id, { name }) {
    const updateFields = {};
    if (name) updateFields.name = name;

    const customerCollection = DB.collection('customers');

    const result = await customerCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnOriginal: false }
    );

    if (!result.value) {
      throw new GraphQLError("Customer not found");
    }

    return result.value;
  }

  static async delete(id) {
    const customerCollection = DB.collection('customers');

    const result = await customerCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async findById(id) {
    const customerCollection = DB.collection('customers');
    const customer = await customerCollection.findOne({ _id: new ObjectId(id) });
    if (!customer) {
      throw new GraphQLError("Customer not found");
    }
    return customer;
  }
}

module.exports = Customer;
