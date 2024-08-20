import { gql } from '@apollo/client';

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($name: String!) {
    createCustomer(name: $name) {
      _id
      name
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: String!, $name: String!) {
    updateCustomer(id: $id, name: $name) {
      _id
      name
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: String!) {
    deleteCustomer(id: $id)
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($packet: String!, $customerId: String!, $balance: Float!, $depositoTypeId: String!) {
    createAccount(packet: $packet, customerId: $customerId, balance: $balance, depositoTypeId: $depositoTypeId) {
      _id
      packet
      balance
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: String!, $packet: String, $balance: Float, $depositoTypeId: String) {
    updateAccount(id: $id, packet: $packet, balance: $balance, depositoTypeId: $depositoTypeId) {
      _id
      packet
      balance
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: String!) {
    deleteAccount(id: $id)
  }
`;

export const CREATE_DEPOSITO_TYPE = gql`
  mutation CreateDepositoType($name: String!, $yearlyReturn: Float!) {
    createDepositoType(name: $name, yearlyReturn: $yearlyReturn) {
      _id
      name
      yearlyReturn
    }
  }
`;

export const UPDATE_DEPOSITO_TYPE = gql`
  mutation UpdateDepositoType($id: String!, $name: String, $yearlyReturn: Float) {
    updateDepositoType(id: $id, name: $name, yearlyReturn: $yearlyReturn) {
      _id
      name
      yearlyReturn
    }
  }
`;

export const DELETE_DEPOSITO_TYPE = gql`
  mutation DeleteDepositoType($id: String!) {
    deleteDepositoType(id: $id)
  }
`;

export const DEPOSIT_MUTATION = gql`
  mutation Deposit($accountId: String!, $amount: Float!) {
    depositToAccount(accountId: $accountId, amount: $amount) {
      _id
      balance
    }
  }
`;

export const WITHDRAW_MUTATION = gql`
  mutation Withdraw($accountId: String!, $amount: Float!) {
    withdrawFromAccount(accountId: $accountId, amount: $amount) {
      _id
      balance
    }
  }
`;
