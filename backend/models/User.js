// models/User.js
const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Address = require('./Address');
    return {
      addresses: {
        relation: Model.HasManyRelation,
        modelClass: Address,
        join: {
          from: 'users.id',
          to: 'addresses.user_id',
        },
      },
    };
  }
}

module.exports = User;
