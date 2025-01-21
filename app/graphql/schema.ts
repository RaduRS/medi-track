import { gql } from "graphql-tag";

const typeDefs = gql`
  enum ResidentStatus {
    ACTIVE
    INACTIVE
  }

  type Resident {
    id: ID!
    name: String!
    roomNumber: Int!
    status: ResidentStatus!
    createdAt: String
  }

  type Query {
    residents: [Resident!]!
    resident(id: ID!): Resident
    residentsByStatus(status: ResidentStatus): [Resident!]!
  }

  type Mutation {
    createResident(
      name: String!
      roomNumber: Int!
      status: ResidentStatus!
    ): Resident!
    updateResident(
      id: ID!
      name: String
      roomNumber: Int
      status: ResidentStatus
    ): Resident!
    deleteResident(id: ID!): Boolean!
  }
`;

export default typeDefs;
