const graphql = require('graphql');
const Product = require('../models/product');
const Department = require('../models/department');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    department: { 
      type: DepartmentType, 
      resolve(parent, args){
        return Department.findById(parent.departmentId);
      }
    },
  })
});

const DepartmentType = new GraphQLObjectType({
  name: 'Department',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({ departmentId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    product: {
      type: ProductType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Product.findById(args.id);
      }
    },
    department: {
      type: DepartmentType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Department.findById(args.id);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args){
        return Product.find({});
      }
    },
    departments: {
      type: new GraphQLList(DepartmentType),
      resolve(parent, args){
        return Department.find({});
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDepartment: {
      type: DepartmentType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args){
        let department = new Department({
          name: args.name
        });
        return department.save();
      }
    },
    addProduct: {
      type: ProductType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        departmentId: {type: GraphQLID},
        price: {type: GraphQLID},
      },
      resolve(parent, args){
        let product = new Product({
          name: args.name,
          departmentId: args.departmentId,
          price: args.price
        });
        return product.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
