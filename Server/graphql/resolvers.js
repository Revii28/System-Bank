const { ApolloError, AuthenticationError } = require('apollo-server-express');
const { hashPassword, comparePassword, generateToken } = require('../helpers/auth');
const { ObjectId } = require('mongodb');

const resolvers = {
    Query: {
        users: async (_, __, { db }) => {
            try {
                return await db.collection('users').find().toArray();
            } catch (error) {
                throw new ApolloError('Error fetching users', 'FETCH_ERROR');
            }
        },
        user: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid user ID', 'VALIDATION_ERROR');
            }
            try {
                return await db.collection('users').findOne({ _id: new ObjectId(id) });
            } catch (error) {
                throw new ApolloError('Error fetching user', 'FETCH_ERROR');
            }
        },
        customer: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid customer ID', 'VALIDATION_ERROR');
            }
            try {
                const customer = await db.collection('customers').findOne({ _id: new ObjectId(id) });
                if (!customer) throw new ApolloError('Customer not found', 'NOT_FOUND');
                return customer;
            } catch (error) {
                throw new ApolloError('Error fetching customer', 'FETCH_ERROR');
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
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid account ID', 'VALIDATION_ERROR');
            }
            try {
                const account = await db.collection('accounts').aggregate([
                    { $match: { _id: new ObjectId(id) } },
                    {
                        $lookup: {
                            from: 'customers',
                            localField: 'customer',
                            foreignField: '_id',
                            as: 'customer'
                        }
                    },
                    { $unwind: '$customer' },
                    {
                        $lookup: {
                            from: 'depositoTypes',
                            localField: 'depositoType',
                            foreignField: '_id',
                            as: 'depositoType'
                        }
                    },
                    { $unwind: '$depositoType' }
                ]).next();
                if (!account) throw new ApolloError('Account not found', 'NOT_FOUND');
                return account;
            } catch (error) {
                throw new ApolloError('Error fetching account', 'FETCH_ERROR');
            }
        },
        accounts: async (_, __, { db }) => {
            try {
                return await db.collection('accounts').aggregate([
                    {
                        $lookup: {
                            from: 'customers',
                            localField: 'customer',
                            foreignField: '_id',
                            as: 'customer'
                        }
                    },
                    { $unwind: '$customer' },
                    {
                        $lookup: {
                            from: 'depositoTypes',
                            localField: 'depositoType',
                            foreignField: '_id',
                            as: 'depositoType'
                        }
                    },
                    { $unwind: '$depositoType' }
                ]).toArray();
            } catch (error) {
                throw new ApolloError('Error fetching accounts', 'FETCH_ERROR');
            }
        },
        depositoType: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid depositoType ID', 'VALIDATION_ERROR');
            }
            try {
                return await db.collection('depositoTypes').findOne({ _id: new ObjectId(id) });
            } catch (error) {
                throw new ApolloError('Error fetching depositoType', 'FETCH_ERROR');
            }
        },
        depositoTypes: async (_, __, { db }) => {
            try {
                return await db.collection('depositoTypes').find().toArray();
            } catch (error) {
                throw new ApolloError('Error fetching depositoTypes', 'FETCH_ERROR');
            }
        },

        getAccountDetails: async (_, { accountId }, { db }) => {
            if (!ObjectId.isValid(accountId)) {
                throw new ApolloError('Invalid account ID', 'VALIDATION_ERROR');
            }
            try {
                const account = await db.collection('accounts').aggregate([
                    { $match: { _id: new ObjectId(accountId) } },
                    {
                        $lookup: {
                            from: 'customers',
                            localField: 'customer',
                            foreignField: '_id',
                            as: 'customer'
                        }
                    },
                    { $unwind: '$customer' },
                    {
                        $lookup: {
                            from: 'depositoTypes',
                            localField: 'depositoType',
                            foreignField: '_id',
                            as: 'depositoType'
                        }
                    },
                    { $unwind: '$depositoType' }
                ]).next();
                if (!account) throw new ApolloError('Account not found', 'NOT_FOUND');
                return account;
            } catch (error) {
                throw new ApolloError('Error fetching account details', 'FETCH_ERROR');
            }
        }
    },

    Mutation: {
        createUser: async (_, { username, password, role }, { db }) => {
            if (!username || !password) {
                throw new ApolloError('Username and password are required', 'VALIDATION_ERROR');
            }
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
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid user ID', 'VALIDATION_ERROR');
            }
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
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid user ID', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting user', 'DELETE_ERROR');
            }
        },

        createCustomer: async (_, { name }, { db }) => {
            if (!name) {
                throw new ApolloError('Name is required', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('customers').insertOne({ name });
                return await db.collection('customers').findOne({ _id: result.insertedId });
            } catch (error) {
                throw new ApolloError('Error creating customer', 'CREATE_ERROR');
            }
        },
        updateCustomer: async (_, { id, name }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid customer ID', 'VALIDATION_ERROR');
            }
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
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid customer ID', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting customer', 'DELETE_ERROR');
            }
        },
        createAccount: async (_, { packet, customerId, balance, depositoTypeId }, { db }) => {
            if (!ObjectId.isValid(customerId) || !ObjectId.isValid(depositoTypeId)) {
                throw new ApolloError('Invalid customer ID or depositoType ID', 'VALIDATION_ERROR');
            }
            try {
                const customer = await db.collection('customers').findOne({ _id: new ObjectId(customerId) });
                if (!customer) throw new ApolloError('Customer not found', 'NOT_FOUND');
                
                const depositoType = await db.collection('depositoTypes').findOne({ _id: new ObjectId(depositoTypeId) });
                if (!depositoType) throw new ApolloError('DepositoType not found', 'NOT_FOUND');
                
              
                const result = await db.collection('accounts').insertOne({
                    packet,
                    customer: new ObjectId(customerId),
                    balance,
                    depositoType: new ObjectId(depositoTypeId)
                });
                
           
                const account = await db.collection('accounts').aggregate([
                    { $match: { _id: result.insertedId } },
                    {
                        $lookup: {
                            from: 'customers',
                            localField: 'customer',
                            foreignField: '_id',
                            as: 'customer'
                        }
                    },
                    { $unwind: '$customer' },
                    {
                        $lookup: {
                            from: 'depositoTypes',
                            localField: 'depositoType',
                            foreignField: '_id',
                            as: 'depositoType'
                        }
                    },
                    { $unwind: '$depositoType' }
                ]).next();
                
                return account;
            } catch (error) {
                throw new ApolloError('Error creating account', 'CREATE_ERROR');
            }
        },
        updateAccount: async (_, { id, packet, balance, depositoTypeId }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid account ID', 'VALIDATION_ERROR');
            }
            try {
                const updateFields = {};
                if (packet) updateFields.packet = packet;
                if (balance) updateFields.balance = balance;
                if (depositoTypeId) {
                    if (!ObjectId.isValid(depositoTypeId)) {
                        throw new ApolloError('Invalid depositoType ID', 'VALIDATION_ERROR');
                    }
                    const depositoType = await db.collection('depositoTypes').findOne({ _id: new ObjectId(depositoTypeId) });
                    if (!depositoType) throw new ApolloError('DepositoType not found', 'NOT_FOUND');
                    updateFields.depositoType = new ObjectId(depositoTypeId);
                }

                const result = await db.collection('accounts').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updateFields },
                    { returnOriginal: false }
                );
                if (!result.value) throw new ApolloError('Account not found', 'NOT_FOUND');

                return result.value;
            } catch (error) {
                throw new ApolloError('Error updating account', 'UPDATE_ERROR');
            }
        },
        deleteAccount: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid account ID', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('accounts').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting account', 'DELETE_ERROR');
            }
        },

        createDepositoType: async (_, { name, yearlyReturn }, { db }) => {
            if (!name || yearlyReturn == null) {
                throw new ApolloError('Name and yearlyReturn are required', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('depositoTypes').insertOne({ name, yearlyReturn });
                return await db.collection('depositoTypes').findOne({ _id: result.insertedId });
            } catch (error) {
                throw new ApolloError('Error creating depositoType', 'CREATE_ERROR');
            }
        },
        updateDepositoType: async (_, { id, name, yearlyReturn }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid depositoType ID', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('depositoTypes').findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: { name, yearlyReturn } },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error updating depositoType', 'UPDATE_ERROR');
            }
        },
        deleteDepositoType: async (_, { id }, { db }) => {
            if (!ObjectId.isValid(id)) {
                throw new ApolloError('Invalid depositoType ID', 'VALIDATION_ERROR');
            }
            try {
                const result = await db.collection('depositoTypes').deleteOne({ _id: new ObjectId(id) });
                return result.deletedCount === 1;
            } catch (error) {
                throw new ApolloError('Error deleting depositoType', 'DELETE_ERROR');
            }
        },

        depositToAccount: async (_, { accountId, amount }, { db }) => {
            if (!ObjectId.isValid(accountId)) {
                throw new ApolloError('Invalid account ID', 'VALIDATION_ERROR');
            }
            try {
                const account = await db.collection('accounts').findOne({ _id: new ObjectId(accountId) });
                if (!account) throw new ApolloError('Account not found', 'NOT_FOUND');

                const result = await db.collection('accounts').findOneAndUpdate(
                    { _id: new ObjectId(accountId) },
                    { $inc: { balance: amount } },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error depositing to account', 'DEPOSIT_ERROR');
            }
        },

        withdrawFromAccount: async (_, { accountId, amount }, { db }) => {
            if (!ObjectId.isValid(accountId)) {
                throw new ApolloError('Invalid account ID', 'VALIDATION_ERROR');
            }
            try {
                const account = await db.collection('accounts').findOne({ _id: new ObjectId(accountId) });
                if (!account) throw new ApolloError('Account not found', 'NOT_FOUND');
                if (account.balance < amount) throw new ApolloError('Insufficient balance', 'BALANCE_ERROR');

                const result = await db.collection('accounts').findOneAndUpdate(
                    { _id: new ObjectId(accountId) },
                    { $inc: { balance: -amount } },
                    { returnOriginal: false }
                );
                return result.value;
            } catch (error) {
                throw new ApolloError('Error withdrawing from account', 'WITHDRAW_ERROR');
            }
        },

        login: async (_, { username, password }, { db }) => {
            if (!username || !password) {
                throw new ApolloError('Username and password are required', 'VALIDATION_ERROR');
            }
            try {
                const user = await db.collection('users').findOne({ username });
                if (!user) throw new AuthenticationError('Invalid username or password');
                const isMatch = await comparePassword(password, user.password);
                if (!isMatch) throw new AuthenticationError('Invalid username or password');
                const token = generateToken(user._id, user.role);
                return { token, user };
            } catch (error) {
                throw new ApolloError('Error logging in', 'LOGIN_ERROR');
            }
        },

        register: async (_, { username, password, role }, { db }) => {
            if (!username || !password) {
                throw new ApolloError('Username and password are required', 'VALIDATION_ERROR');
            }
            try {
                const hashedPassword = await hashPassword(password);
                const result = await db.collection('users').insertOne({
                    username,
                    password: hashedPassword,
                    role: role || 'customer'
                });
                return {
                    message: 'success'
                };
            } catch (error) {
                throw new ApolloError('Error registering user', 'REGISTER_ERROR');
            }
        }
    },

    Account: {
        balanceWithInterest: (account, { months }) => {
            const { balance, depositoType } = account;
            if (!months || !depositoType) return balance;

            const monthlyReturn = depositoType.yearlyReturn / 12 / 100;
            return balance * (1 + monthlyReturn) ** months;
        }
    }
};

module.exports = resolvers;
