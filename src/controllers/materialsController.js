const { v4: uuidv4 } = require('uuid');
const restifyErrors = require('restify-errors');
const client = require("../services/dbService");
const { materialSchema } = require("../validators/materialsValidators");

const getMaterials = async (req, res) => {
    try {
        const materials = await client("materials").select();
        res.send(materials);
    } catch (err) {
        res.send(new restifyErrors.InternalServerError(err.message));
    }
};

const createMaterial = async (req, res) => {
    console.log('Request Body:', req.body)
    try {
        // Validate request body
        const { error, value } = materialSchema.validate(req.body);
        if (error) {
            return res.send(new restifyErrors.BadRequestError(error.details[0].message));
        }

        // Create construction site
        const constructionSiteId = uuidv4();
        await client("construction_sites").insert({ id: constructionSiteId });

        // Add construction_site_id to the material data
        const materialData = {
            ...value,
            construction_site_id: constructionSiteId
        };

        // Create material
        const material = await client("materials").insert(materialData).returning("*");
        res.send(material[0]);
    } catch (err) {
        res.send(new restifyErrors.InternalServerError(err.message));
    }
};

const updateMaterial = async (req, res) => {
    try {
        await client("materials").where("id", req.params.id).update(req.body);
        res.send('updated successfully');
    } catch (err) {
        res.send(new restifyErrors.InternalServerError(err.message));
    }
};

// delete materials
const deleteMaterial = async (req, res) => {
    try {
        await client("materials").where("id", req.params.id).del();
        res.send(204);
    } catch (err) {
        res.send(new restifyErrors.InternalServerError(err.message));
    }
};

// get materials by ID
const getMaterial = async (req, res) => {
    try {
        const material = await client("materials").where("id", req.params.id).first();
        if (!material) {
            return res.send(new restifyErrors.NotFoundError(`Material with ID ${req.params.id} not found`));
        }

        res.send(material);
    } catch (err) {
        res.send(new restifyErrors.InternalServerError(err.message));
    }
};

module.exports = {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterial
};
