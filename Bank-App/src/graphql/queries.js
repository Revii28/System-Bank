import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      username
      role
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      _id
      username
      role
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      _id
      name
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      _id
      name
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      _id
      packet
      customer {
        _id
        name
      }
      balance
      depositoType {
        _id
        name
        yearlyReturn
      }
      balanceWithInterest
    }
  }
`;

export const GET_ACCOUNT = gql`
  query GetAccount($id: ID!) {
    account(id: $id) {
      _id
      packet
      balance
      customer {
        _id
        name
      }
      depositoType {
        _id
        name
        yearlyReturn
      }
      balanceWithInterest
    }
  }
`;

export const GET_DEPOSITO_TYPES = gql`
query DepositoTypes {
  depositoTypes {
    _id
    name
    yearlyReturn
  }
}
`;

export const GET_DEPOSITO_TYPE = gql`
  query GetDepositoType($id: ID!) {
    depositoType(id: $id) {
      _id
      name
      yearlyReturn
    }
  }
`;

export const GET_ACCOUNT_DETAILS = gql`
query GetAccountDetails($accountId: ID!) {
  getAccountDetails(accountId: $accountId) {
    _id
    packet
    customer {
      _id
      name
    }
    balance
    depositoType {
      _id
      name
      yearlyReturn
    }
    balanceWithInterest
  }
}
`