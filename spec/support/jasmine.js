const request = require('supertest');
const restify = require('restify');
const knex = require('knex');
const connectionString = require('../../connectionString'); // Ensure this path is correct
const { getMaterials, createMaterial, updateMaterial, deleteMaterial, getMaterial } = require('../../src/controllers/materialsController');

// Initialize server and Knex client
const server = restify.createServer();
server.pre(restify.pre.sanitizePath());
server.pre(restify.pre.userAgentConnection());
server.use(restify.plugins.bodyParser()); // Add this line to enable JSON body parsing

// Initialize Knex client
const client = knex({
    client: 'pg',
    connection: connectionString,
});

server.get('/materials', getMaterials);
server.post('/materials', createMaterial);
server.put('/materials/:id', updateMaterial);
server.del('/materials/:id', deleteMaterial);
server.get('/materials/:id', getMaterial);

// Jasmine test suite
describe('Materials API', () => {
    let materialId;

    beforeAll(async () => {
        // Run migrations or seed data if necessary
        await client.migrate.latest();
    });

    afterAll(async () => {
        // Clean up database and close connections
        await client.destroy();
    });

    it('GET /materials should return all materials', async () => {
        const response = await request(server)
            .get('/materials')
        expect(response.status).toBe(200);
    });

    it('POST /materials should create a new material', async () => {
        const response = await request(server)
            .post('/materials')
            .set('Content-Type', 'application/json')
            .send({
                name: 'Concrete',
                volume: 100,
                cost_per_cubic_meter: 50,
                color: 'Gray',
                delivery_date: '2024-08-01',
            });

        // Check that the response body has an ID and construction_site_id
        expect(response.body).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            construction_site_id: jasmine.any(String)
        }));

        // Save the material ID for use in subsequent tests
        materialId = response.body.id;
    });

    it('GET /materials/:id should return a material by ID', async () => {
        const response = await request(server)
            .get(`/materials/${materialId}`)

        expect(response.body).toEqual(jasmine.objectContaining({
            id: materialId
        }));
    });


    it('PUT /materials/:id should update an existing material', async () => {
        const response = await request(server)
            .put(`/materials/${materialId}`)
            .send({
                volume: 150,
            })

        expect(response.body).toBe('updated successfully');
    });

    it('DELETE /materials/:id should delete a material by ID', async () => {
        await request(server)
            .delete(`/materials/${materialId}`)
            .expect(204);
    });
});
