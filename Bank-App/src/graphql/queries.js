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

export const GET_CUSTOMER = gql`
  query GetCustomer($id: String!) {
    customer(id: $id) {
      _id
      name
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

export const GET_ACCOUNT = gql`
  query GetAccount($id: String!) {
    account(id: $id) {
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
      balanceWithInterest(months: 12)
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
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
      balanceWithInterest(months: 12)
    }
  }
`;

export const GET_DEPOSITO_TYPE = gql`
  query GetDepositoType($id: String!) {
    depositoType(id: $id) {
      _id
      name
      yearlyReturn
    }
  }
`;

export const GET_DEPOSITO_TYPES = gql`
  query GetDepositoTypes {
    depositoTypes {
      _id
      name
      yearlyReturn
    }
  }
`;
