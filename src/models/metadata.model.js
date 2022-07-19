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
      required: false,
      trim: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if metadata url in already exist is metadata collection
 * @param {string} url - The metadata url
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
