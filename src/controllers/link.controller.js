const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { linkService } = require('../services');

const createLink = catchAsync(async (req, res) => {
  // pass the user id for link creation
  const link = await linkService.createLink({ ...req.body, userId: req.user.id });
  if (!link) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create new link');
  }
  res.status(httpStatus.CREATED).send(link);
});

const getLinks = catchAsync(async (req, res) => {
  let filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  // always show only user's links
  filter = { ...filter, userId: req.user.id };
  const result = await linkService.queryLinks(filter);
  res.send(result);
});

const updateLink = catchAsync(async (req, res) => {
  const user = await linkService.updateLinkById(req.user.id, req.params.linkId, req.body);
  res.send(user);
});

const deleteLink = catchAsync(async (req, res) => {
  await linkService.deleteLinkById(req.user.id, req.params.linkId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLink,
  getLinks,
  updateLink,
  deleteLink,
};
