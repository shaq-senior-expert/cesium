const knex = require("knex");
const { randomUUID } = require("crypto");
const connectionString = require("../connectionString");

const client = knex({
  client: "pg",
  connection: connectionString,
});

async function main() {
  try {
    // Delete all existing sites and materials
    await client("materials").delete();
    await client("construction_sites").delete();

    // Create some dummy sites and materials
    for (let i = 0; i < 5; i++) {
      // Create construction site
      const constructionSiteId = randomUUID();
      await client("construction_sites").insert({ id: constructionSiteId });

      console.log(`Created construction site with id ${constructionSiteId}`);

      // Create materials for the construction site
      for (let j = 0; j < 5; j++) {
        const materialId = await client("materials").insert({
          name: `Material ${i}-${j}`,
          volume: (Math.random() * 100).toFixed(2), // Random volume
          cost_per_cubic_meter: (Math.random() * 1000).toFixed(2), // Random cost
          color: ["Red", "Blue", "Green", "Yellow", "Black"][Math.floor(Math.random() * 5)], // Random color
          delivery_date: new Date().toISOString(), // Current date as delivery date
          construction_site_id: constructionSiteId,
        }).returning("id");

        console.log(`Created material with id ${materialId[0].id} for construction site ${constructionSiteId}`);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.destroy();
  }
}

main();
