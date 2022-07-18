const Joi = require('joi');
const { httpUrl, objectId } = require('./custom.validation');

const createLink = {
  body: Joi.object().keys({
    url: Joi.string().required().custom(httpUrl),
    name: Joi.string(),
  }),
};

const getLinks = {
  query: Joi.object().keys({
    url: Joi.string(),
    name: Joi.string(),
    filter: Joi.string(),
  }),
};

const updateLink = {
  params: Joi.object().keys({
    linkId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      url: Joi.string().custom(httpUrl),
      name: Joi.string(),
    })
    .min(1),
};

const deleteLink = {
  params: Joi.object().keys({
    linkId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createLink,
  getLinks,
  updateLink,
  deleteLink,
};
