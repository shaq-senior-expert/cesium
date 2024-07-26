exports.up = function (knex) {
    return knex.schema.createTable("materials", function (table) {
        table.increments("id").primary();
        table.string("name").nullable();
        table.decimal("volume", 10, 2).notNullable(); // Volume in cubic meters
        table.decimal("cost_per_cubic_meter", 10, 2).notNullable(); // Cost per cubic meter in USD
        table.string("color").notNullable(); // Color
        table.date("delivery_date").nullable(); // Delivery date
        table.uuid("construction_site_id").notNullable(); // Foreign key to construction_sites
        table.foreign("construction_site_id").references("id").inTable("construction_sites").onDelete("CASCADE");
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("materials");
};
