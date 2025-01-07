const { Model } = require('objection');

class Address extends Model {
  static get tableName() {
    return 'addresses';
  }

  static get relationMappings() {
    const Language = require('./Language');
    const User = require('./User');  

    return {
      languages: {
        relation: Model.HasManyRelation,
        modelClass: Language,
        join: {
          from: 'addresses.city',
          to: 'languages.city', 
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'addresses.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Address;
