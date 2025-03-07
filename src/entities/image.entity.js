const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Image",
    tableName: "images",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        product_name: {  // Changed to lowercase
            type: "varchar",
        },
        input_url: {  // Changed to lowercase
            type: "text",
        },
        output_url: {  // Changed to lowercase
            type: "text",
            nullable: true,
        },
        request_id: {  // Changed to lowercase
            type: "uuid",
        },
    },
});
