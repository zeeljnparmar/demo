const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Image',
    tableName: 'images',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        request_id: {
            type: 'uuid',
            nullable: false,
        },
        input_url: {
            type: 'text',
            nullable: false,
        },
        output_url: {
            type: 'text',
            nullable: true,
        },
        status: {
            type: 'varchar',
            default: 'Pending',
        },
    },
    relations: {
        request: {
            target: 'Request',
            type: 'many-to-one',
            joinColumn: { name: 'request_id' },
            onDelete: 'CASCADE',
        }
    }
});