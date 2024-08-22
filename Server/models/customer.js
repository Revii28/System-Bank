const { ObjectId } = require('mongodb');

class Customer {
  static async findById(id) {
    const customerCollection = DB.collection('customers');
    const customer = await customerCollection.findOne({ _id: new ObjectId(id) });
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }
}

module.exports = Customer;
