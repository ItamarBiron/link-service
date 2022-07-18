const mongoose = require('mongoose');

const metadataSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Object,
      required: true,
      trim: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if link url in already exist for the current user
 * @param {string} url - The link url
 * @param {string} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
metadataSchema.statics.isUrlMetadataExist = async function (url) {
  const metaData = await this.findOne({ _id: url });
  return !!metaData;
};

/**
 * @typedef Metadata
 */
const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata;
