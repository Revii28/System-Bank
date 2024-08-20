const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Customer {
        _id: String
        name: String!
        role: String!
    }

    type Account {
        _id: String
        packet: String!
        customer: Customer!
        balance: Float!
    }

    type DepositoType {
        _id: String
        name: String!
        yearlyReturn: Float!
    }

    type Query {
        customers: [Customer]
        accounts: [Account]
        depositoTypes: [DepositoType]
    }

    type Mutation {
        createCustomer(name: String!, role: String!): Customer
        updateCustomer(id: String!, name: String, role: String): Customer
        deleteCustomer(id: String!): Boolean

        createAccount(packet: String!, customerId: String!, balance: Float): Account
        updateAccount(id: String!, packet: String, balance: Float): Account
        deleteAccount(id: String!): Boolean

        createDepositoType(name: String!, yearlyReturn: Float!): DepositoType
        updateDepositoType(id: String!, name: String, yearlyReturn: Float): DepositoType
        deleteDepositoType(id: String!): Boolean
    }
`;

module.exports = typeDefs;
