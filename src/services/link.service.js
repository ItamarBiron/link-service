const httpStatus = require('http-status');
const urlMetadata = require('url-metadata');
const { Link } = require('../models');
const { Metadata } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get url metadata with requset
 * @param {string} url
 * @returns {object} metadata
 */
const getUrlMetadata = async (url) => {
  await urlMetadata(url).then(
    function (metadata) {
      // success handler
      newMetaData = metadata;
    },
    function (error) {
      // failure handler
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Could not get metadata for url ${url}
       error:${error}`);
    }
  );
  return newMetaData;
};

/**
 * Create url metadata object in Metadat DB if not already exist, by request to internet
 * @param {string} url
 * @returns {object} metadata
 */
async function createMetatdataFromUrl(url) {
  const metadata = await getUrlMetadata(url);
  const metadataObject = { _id: url, metadata };
  await Metadata.create(metadataObject);
  return metadata;
}

/**
 * Create a user
 * @param {Object} linkBody
 * @returns {Promise<Link>}
 */
const createLink = async (linkBody) => {
  const { url } = linkBody;
  if (await Link.isUrlTaken(url, linkBody.userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Url already taken');
  }

  let metadata = await Metadata.findOne({ _id: url });
  if (!metadata) {
    metadata = await createMetatdataFromUrl(url);
  }
  return Link.create({ ...linkBody, metadata });
};

/**
 * Query for links
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLinks = async (filter, options) => {
  const links = await Link.find(filter, options);
  return links;
};

/**
 * Get userLink by user id and link id
 * @param {ObjectId} userId
 * @param {ObjectId} linkId
 * @returns {Promise<Link>}
 */
const getLinkByIds = async (userId, linkId) => {
  const filter = { _id: String(linkId), userId: String(userId) };
  return Link.findOne(filter);
};

/**
 * Update Link by id
 * @param {ObjectId} LinkId
 * @param {Object} UpdateBody
 * @returns {Promise<Link>}
 */
const updateLinkById = async (userId, linkId, updateBody) => {
  const link = await getLinkByIds(userId, linkId);
  const newUrl = updateBody.url;
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link not found');
  }
  if (newUrl && (await Link.isUrlTaken(newUrl, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Url already taken');
  }

  let fullObject = { ...updateBody };
  if (updateBody.url) {
    const metadata = await Metadata.findOne({ _id: newUrl });
    if (!metadata) {
      const mewMetadata = await createMetatdataFromUrl(newUrl);
      fullObject = { ...fullObject, metadata: mewMetadata };
    }
  }
  Object.assign(link, fullObject);
  await link.save();
  return link;
};

/**
 * Delete Link by id
 * @param {ObjectId} userId
 * @param {ObjectId} linkId
 * @returns {Promise<User>}
 */
const deleteLinkById = async (userId, linkId) => {
  const link = await getLinkByIds(userId, linkId);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link not found');
  }
  await link.remove();
  return link;
};

module.exports = {
  createLink,
  queryLinks,
  updateLinkById,
  deleteLinkById,
};
