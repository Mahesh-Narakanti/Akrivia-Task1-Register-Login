const { Model } = require('objection');

class Language extends Model {
  static get tableName() {
    return 'languages';
  }

  static get relationMappings() {
    const Address = require('./Address');  

    return {
      address: {
        relation: Model.BelongsToOneRelation,
        modelClass: Address,
        join: {
          from: 'languages.city',
          to: 'addresses.city',
        },
      },
    };
  }
}

module.exports = Language;
