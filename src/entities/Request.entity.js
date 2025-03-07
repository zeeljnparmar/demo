const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Request",
    tableName: "requests",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        status: {
            type: "varchar",
            default: "processing", // processing | completed | failed
        },
    },
});
