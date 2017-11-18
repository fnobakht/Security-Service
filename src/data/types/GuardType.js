import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import GraphQLDate from 'graphql-date';
import Security from './SecurityType';

const Guard = new GraphQLObjectType({
  name: 'Guard',
  description: 'Guard (part of a security group)',

  fields: () => {
    return {
      groupID: {
        type: GraphQLInt,
        resolve(guard) {
          return guard.groupID;
        },
      },
      accessID: {
        type: GraphQLString,
        resolve(guard) {
          return guard.accessID;
        },
      },
      dispatchNumber: {
        type: GraphQLInt,
        resolve(guard) {
          return guard.dispatchNumber;
        },
      },
      location: {
        type: GraphQLString,
        resolve(guard) {
          return guard.location;
        },
      },
      startDate: {
        type: GraphQLDate,
        resolve(guard) {
          return guard.startDate;
        },
      },
      endDate: {
        type: GraphQLDate,
        resolve(guard) {
          return guard.endDate;
        },
      },
      guardname: {
        type: GraphQLString,
        resolve(guard) {
          return guard.guardname;
        },
      },
      telephone: {
        type: GraphQLString,
        resolve(guard) {
          return guard.telephone;
        },
      },
      remarks: {
        type: GraphQLString,
        resolve(guard) {
          return guard.remarks;
        },
      },
      request: {
        type: new GraphQLList(Security),
        resolve(guard) {
          return guard.getSecurities();
        },
      },
    };
  },
});


export default Guard;