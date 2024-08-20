import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
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
      balance
      customer {
        name
      }
      depositoType {
        name
      }
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
