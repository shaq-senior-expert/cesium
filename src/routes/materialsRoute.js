const materialsController = require("../controllers/materialsController");

module.exports = (server) => {
    server.get('/materials', materialsController.getMaterials);
    server.get('/materials/:id', materialsController.getMaterial);
    server.post('/materials', materialsController.createMaterial);
    server.put('/materials/:id', materialsController.updateMaterial);
    server.del('/materials/:id', materialsController.deleteMaterial);
};
