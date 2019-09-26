const graphql = require('graphql');
const axios = require('axios');
const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

const GenderType = new GraphQLObjectType ({
    name: "Gender",
    fields: () => ({
        id: {type: GraphQLString},
        gender: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/genders/${parentValue.id}/users`)
                .then(res => res.data);
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        cell_num: { type: GraphQLString },
        age: { type: GraphQLInt },
        education: { type: GraphQLString},
        crossing_freq: { type: GraphQLString },
        produce: { type: GraphQLString },
        primary_income: { type: GraphQLString },
        language: { type: GraphQLString },
        country_of_residence: { type: GraphQLString },
        gender: { 
            type: GenderType,
            resolve(parentValue, args ) {
                return axios.get(`http://localhost:3000/genders/${parentValue.genderId}`)
                .then(res => res.data)
            }
        },

    })
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }
            },
            resolve(parentValue, { id }){
                return axios.get(`http://localhost:3000/users/${id}`)
                .then(res => res.data)
            }
        },
        gender: {
            type: GenderType,
            args: { id: {type: GraphQLString }},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/genders/${args.id}`)
                .then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
});