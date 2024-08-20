const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: String!
        username: String!
        password: String!
        role: String
    }

    type Customer {
        _id: String!
        name: String!
    }

    type Account {
        _id: String!
        packet: String!
        customer: Customer!
        balance: Float!
        depositoType: DepositoType!
        balanceWithInterest(months: Int): Float
    }

    type DepositoType {
        _id: String!
        name: String!
        yearlyReturn: Float!
    }

    type Query {
        users: [User]
        customer(id: String!): Customer
        customers: [Customer]
        account(id: String!): Account
        accounts: [Account]
        depositoType(id: String!): DepositoType
        depositoTypes: [DepositoType]
    }

    type Mutation {
        createUser(username: String!, password: String!, role: String): User
        updateUser(id: String!, username: String, password: String, role: String): User
        deleteUser(id: String!): Boolean

        createCustomer(name: String!): Customer
        updateCustomer(id: String!, name: String!): Customer
        deleteCustomer(id: String!): Boolean

        createAccount(packet: String!, customerId: String!, balance: Float!, depositoTypeId: String!): Account
        updateAccount(id: String!, packet: String, balance: Float, depositoTypeId: ID): Account
        deleteAccount(id: String!): Boolean

        createDepositoType(name: String!, yearlyReturn: Float!): DepositoType
        updateDepositoType(id: String!, name: String, yearlyReturn: Float): DepositoType
        deleteDepositoType(id: String!): Boolean

        depositToAccount(accountId: String!, amount: Float!): Account
        withdrawFromAccount(accountId: String!, amount: Float!): Account
    }
`;

module.exports = typeDefs;
