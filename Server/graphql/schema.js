const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        role: String
    }

    type Customer {
        _id: ID!
        name: String!
    }

    type Account {
        _id: ID!
        packet: String!
        customer: Customer!
        balance: Float!
        depositoType: DepositoType!
        balanceWithInterest(months: Int): Float
    }

    type DepositoType {
        _id: ID!
        name: String!
        yearlyReturn: Float!
    }

    type AuthPayload {
        token: String!
        user: User
    }

    type Register {
        message: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User
        customer(id: ID!): Customer
        customers: [Customer]
        account(id: ID!): Account
        accounts: [Account]
        depositoType(id: ID!): DepositoType
        depositoTypes: [DepositoType]

 
        getAccountDetails(accountId: ID!): Account
    }

    type Mutation {
        createUser(username: String!, password: String!, role: String): User
        updateUser(id: ID!, username: String, password: String, role: String): User
        deleteUser(id: ID!): Boolean

        createCustomer(name: String!): Customer
        updateCustomer(id: ID!, name: String!): Customer
        deleteCustomer(id: ID!): Boolean

        createAccount(packet: String!, customerId: ID!, balance: Float!, depositoTypeId: ID!): Account
        updateAccount(id: ID!, packet: String, balance: Float, depositoTypeId: ID): Account
        deleteAccount(id: ID!): Boolean

        createDepositoType(name: String!, yearlyReturn: Float!): DepositoType
        updateDepositoType(id: ID!, name: String, yearlyReturn: Float): DepositoType
        deleteDepositoType(id: ID!): Boolean

        depositToAccount(accountId: ID!, amount: Float!): Account
        withdrawFromAccount(accountId: ID!, amount: Float!): Account


        depositAmount(accountId: ID!, amount: Float!): Account
        withdrawAmount(accountId: ID!, amount: Float!): Account

        login(username: String!, password: String!): AuthPayload
        register(username: String!, password: String!, role: String): Register
    }
`;

module.exports = typeDefs;
