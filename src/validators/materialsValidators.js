const Joi = require('joi');

const materialSchema = Joi.object({
    name: Joi.string().optional(),
    volume: Joi.number().positive().required(),
    cost_per_cubic_meter: Joi.number().positive().required(),
    color: Joi.string().required(),
    delivery_date: Joi.date().optional(),
    construction_site_id: Joi.string().uuid().optional() // This will be added automatically in the controller
});

module.exports = {
    materialSchema
};
