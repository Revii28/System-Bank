const { ApolloError } = require('apollo-server-express');
const User = require('../models/user');
const Customer = require('../models/customer');
const Account = require('../models/account');
const DepositoType = require('../models/depositoType');
const { ObjectId } = require('mongodb');
const { hashPassword } = require('../helpers/auth'); 

const resolvers = {
    Query: {
        users: async (_, __, { db }) => {
            try {
                return await db.collection('users').find().toArray();
            } catch (error) {
                throw new ApolloError('Error fetching users', 'FETCH_ERROR');
            }
        },
        customer: async (_, { id }, { db }) => {
            try {
                return await db.collection('customers').findOne({ _id: new ObjectId(id) });
            } catch (error) {
                throw new ApolloError('Customer not found', 'NOT_FOUND');
            }
        },
        customers: async (_, __, { db }) => {
            try {
                return await db.collection('customers').find().toArray();
            } catch (error) {
                throw new ApolloError('Error fetching customers', 'FETCH_ERROR');
            }
        },
        account: async (_, { id }, { db }) => {
            try {
                return await db.collection('accounts').findOne({ _id: new ObjectId(id) });
            } catch (error) {
                throw new ApolloError('Account not found', 'NOT_FOUND');
            }
        },
        accounts: async (_, __, { db }) => {
            try {
                return await db.collection('accounts').find().toArray();
            } catch (error) {
                throw new ApolloError('Error fetching accounts', 'FETCH_ERROR');
            }
        },
        depositoType: async (_, { id }, { db }) => {
            try {
                return await db.collection('depositoTypes').findOne({ _id: new ObjectId(id) });
            } catch (error) {
                throw new ApolloError('DepositoType not found', 'NOT_FOUND');
            }
        },
        depositoTypes: async (_, __, { db }) => {
            try {
                return await db.collection('depositoTypes').find().toArray();
            } catch (error) {
                throw new ApolloError('Error fetching depositoTypes', 'FETCH_ERROR');
            }
        },
    },
    
    Mutation: {
        createUser: async (_, { username, password, role }, { db }) => {
            try {
                const hashedPassword = await hashPassword(password);
                const result = await db.collection('users').insertOne({
                    username,
                    password: hashedPassword,
                    role: role || "customer"
                });
                return await db.collection('users').findOne({ _id: result.insertedId });
            } catch (error) {
                throw new ApolloError('Error creating user', 'CREATE_ERROR');
            }
        },
        updateUser: async (_, { id, username, password, role }, { db }) => {
            try {
                const updateFields = {};
                if (username) updateFields.username = username;
                if (password) updateFields.password = await hashPassword(password);
                if (role) updateFields.role = role;

                const result = await db.collection('users').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updateFields },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error updating user', 'UPDATE_ERROR');
            }
        },
        deleteUser: async (_, { id }, { db }) => {
            try {
                const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting user', 'DELETE_ERROR');
            }
        },

        createCustomer: async (_, { name }, { db }) => {
            try {
                const result = await db.collection('customers').insertOne({ name });
                return await db.collection('customers').findOne({ _id: result.insertedId });
            } catch (error) {
                throw new ApolloError('Error creating customer', 'CREATE_ERROR');
            }
        },
        updateCustomer: async (_, { id, name }, { db }) => {
            try {
                const result = await db.collection('customers').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: { name } },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error updating customer', 'UPDATE_ERROR');
            }
        },
        deleteCustomer: async (_, { id }, { db }) => {
            try {
                const result = await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting customer', 'DELETE_ERROR');
            }
        },

        createAccount: async (_, { packet, customerId, balance, depositoTypeId }, { db }) => {
            try {
                const result = await db.collection('accounts').insertOne({
                    packet,
                    customer: new ObjectId(customerId),
                    balance,
                    depositoType: new ObjectId(depositoTypeId)
                });
                return await db.collection('accounts').findOne({ _id: result.insertedId });
            } catch (error) {
                throw new ApolloError('Error creating account', 'CREATE_ERROR');
            }
        },
        updateAccount: async (_, { id, packet, balance, depositoTypeId }, { db }) => {
            try {
                const updateFields = {};
                if (packet) updateFields.packet = packet;
                if (balance !== undefined) updateFields.balance = balance;
                if (depositoTypeId) updateFields.depositoType = new ObjectId(depositoTypeId);

                const result = await db.collection('accounts').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updateFields },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error updating account', 'UPDATE_ERROR');
            }
        },
        deleteAccount: async (_, { id }, { db }) => {
            try {
                const result = await db.collection('accounts').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting account', 'DELETE_ERROR');
            }
        },

        createDepositoType: async (_, { name, yearlyReturn }, { db }) => {
            try {
                const result = await db.collection('depositoTypes').insertOne({ name, yearlyReturn });
                return await db.collection('depositoTypes').findOne({ _id: result.insertedId });
            } catch (error) {
                throw new ApolloError('Error creating depositoType', 'CREATE_ERROR');
            }
        },
        updateDepositoType: async (_, { id, name, yearlyReturn }, { db }) => {
            try {
                const updateFields = {};
                if (name) updateFields.name = name;
                if (yearlyReturn !== undefined) updateFields.yearlyReturn = yearlyReturn;

                const result = await db.collection('depositoTypes').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updateFields },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error updating depositoType', 'UPDATE_ERROR');
            }
        },
        deleteDepositoType: async (_, { id }, { db }) => {
            try {
                const result = await db.collection('depositoTypes').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting depositoType', 'DELETE_ERROR');
            }
        },

        depositToAccount: async (_, { accountId, amount }, { db }) => {
            try {
                const account = await db.collection('accounts').findOne({ _id: new ObjectId(accountId) });
                if (!account) throw new ApolloError('Account not found', 'NOT_FOUND');

                account.balance += amount;
                await db.collection('accounts').updateOne(
                    { _id: new ObjectId(accountId) },
                    { $set: { balance: account.balance } }
                );
                return account;
            } catch (error) {
                throw new ApolloError('Error depositing to account', 'DEPOSIT_ERROR');
            }
        },
        withdrawFromAccount: async (_, { accountId, amount }, { db }) => {
            try {
                const account = await db.collection('accounts').findOne({ _id: new ObjectId(accountId) });
                if (!account) throw new ApolloError('Account not found', 'NOT_FOUND');

                if (account.balance < amount) throw new ApolloError('Insufficient balance', 'INSUFFICIENT_BALANCE');

                account.balance -= amount;
                await db.collection('accounts').updateOne(
                    { _id: new ObjectId(accountId) },
                    { $set: { balance: account.balance } }
                );
                return account;
            } catch (error) {
                throw new ApolloError('Error withdrawing from account', 'WITHDRAW_ERROR');
            }
        }
    },

    Account: {
        customer: async (account, _, { db }) => {
            try {
                return await db.collection('customers').findOne({ _id: account.customer });
            } catch (error) {
                throw new ApolloError('Error fetching customer', 'FETCH_ERROR');
            }
        },
        depositoType: async (account, _, { db }) => {
            try {
                return await db.collection('depositoTypes').findOne({ _id: account.depositoType });
            } catch (error) {
                throw new ApolloError('Error fetching depositoType', 'FETCH_ERROR');
            }
        },
        balanceWithInterest: async (account, { months }, { db }) => {
            try {
                if (!months || months <= 0) return account.balance;

                const depositoType = await db.collection('depositoTypes').findOne({ _id: account.depositoType });
                if (!depositoType) throw new ApolloError('DepositoType not found', 'NOT_FOUND');

                const interest = (account.balance * depositoType.yearlyReturn / 100) * (months / 12);
                return account.balance + interest;
            } catch (error) {
                throw new ApolloError('Error calculating balance with interest', 'CALCULATION_ERROR');
            }
        }
    }
};

module.exports = resolvers;
