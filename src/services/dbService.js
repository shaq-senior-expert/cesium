const knex = require("knex");
const connectionString = require("../../connectionString");

const client = knex({
    client: "pg",
    connection: connectionString,
});

module.exports = client;
