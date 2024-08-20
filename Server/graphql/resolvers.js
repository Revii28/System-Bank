const Customer = require('../models/customer');
const Account = require('../models/account');
const DepositoType = require('../models/depositoType');

const resolvers = {
    Query: {
        customers: () => Customer.find(),
        accounts: () => Account.find().populate('customer'),
        depositoTypes: () => DepositoType.find(),
    },
    Mutation: {
        createCustomer: async (_, { name, role }) => {
            const customer = new Customer({ name, role });
            return customer.save();
        },
        updateCustomer: async (_, { id, name, role }) => {
            return Customer.findByIdAndUpdate(id, { name, role }, { new: true });
        },
        deleteCustomer: async (_, { id }) => {
            await Customer.findByIdAndDelete(id);
            return true;
        },
        createAccount: async (_, { packet, customerId, balance }) => {
            const account = new Account({ packet, customer: customerId, balance });
            return account.save();
        },
        updateAccount: async (_, { id, packet, balance }) => {
            return Account.findByIdAndUpdate(id, { packet, balance }, { new: true });
        },
        deleteAccount: async (_, { id }) => {
            await Account.findByIdAndDelete(id);
            return true;
        },
        createDepositoType: async (_, { name, yearlyReturn }) => {
            const depositoType = new DepositoType({ name, yearlyReturn });
            return depositoType.save();
        },
        updateDepositoType: async (_, { id, name, yearlyReturn }) => {
            return DepositoType.findByIdAndUpdate(id, { name, yearlyReturn }, { new: true });
        },
        deleteDepositoType: async (_, { id }) => {
            await DepositoType.findByIdAndDelete(id);
            return true;
        },
    },
};

module.exports = resolvers;
