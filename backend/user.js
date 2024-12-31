const { Model } = require('objection');

class user extends Model {
    static get tableName() {
        return 'reg';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                address: { type: 'string' },
                languages: { type: 'string' },
            },
        };
    }
}
module.exports=user;