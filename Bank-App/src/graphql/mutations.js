import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $role: String) {
    createUser(username: $username, password: $password, role: $role) {
      _id
      username
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $username: String, $password: String, $role: String) {
    updateUser(id: $id, username: $username, password: $password, role: $role) {
      _id
      username
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

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
mutation Mutation($packet: String!, $customerId: ID!, $balance: Float!, $depositoTypeId: ID!) {
  createAccount(packet: $packet, customerId: $customerId, balance: $balance, depositoTypeId: $depositoTypeId) {
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

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: String!, $packet: String, $balance: Float, $depositoTypeId: String) {
    updateAccount(id: $id, packet: $packet, balance: $balance, depositoTypeId: $depositoTypeId) {
      _id
      packet
      balance
      depositoType {
        _id
        name
        yearlyReturn
      }
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
mutation UpdateDepositoType($updateDepositoTypeId: ID!, $name: String, $yearlyReturn: Float) {
  updateDepositoType(id: $updateDepositoTypeId, name: $name, yearlyReturn: $yearlyReturn) {
    _id
    name
    yearlyReturn
  }
}
`;

export const DELETE_DEPOSITO_TYPE = gql`
mutation DeleteDepositoType($deleteDepositoTypeId: ID!) {
  deleteDepositoType(id: $deleteDepositoTypeId)
}
`;

export const DEPOSIT_TO_ACCOUNT = gql`
  mutation DepositToAccount($accountId: String!, $amount: Float!) {
    depositToAccount(accountId: $accountId, amount: $amount) {
      _id
      balance
    }
  }
`;

export const WITHDRAW_FROM_ACCOUNT = gql`
  mutation WithdrawFromAccount($accountId: String!, $amount: Float!) {
    withdrawFromAccount(accountId: $accountId, amount: $amount) {
      _id
      balance
    }
  }
`;

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      _id
      username
      role
    }
    token
  }
}
`;

export const REGISTER = gql`
mutation Register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    message
  }
}
`;
