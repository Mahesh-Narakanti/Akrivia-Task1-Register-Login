const knexConfig = require('./knexfile'); 
const knex = require('knex')(knexConfig);
const { Model } = require('objection');

Model.knex(knex);

module.exports = knex; 
