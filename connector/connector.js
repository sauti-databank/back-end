const Sequelize  = require('sequelize');

const sequelize = new Sequelize('mysql', 'lambda2019', 'JlgRzqmvh83Z', {
    host: '160.153.141.46',
    dialect: 'mysql',
    port: 3306
} )

module.exports sequelize;