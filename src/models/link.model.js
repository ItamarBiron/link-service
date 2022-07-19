const mongoose = require('mongoose');
const { httpUrl } = require('../validations/custom.validation');

const linkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: false,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!httpUrl(value)) {
          throw new Error('Invalid url');
        }
      },
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

// make combination of index userId and url unique in mongo level
linkSchema.index({ userId: 1, url: 1 }, { unique: true });

/**
 * Check if link url in already exist for the current user
 * @param {string} url - The link url
 * @param {string} userId - The id of the user
 * @returns {Promise<boolean>}
 */
linkSchema.statics.isUrlTaken = async function (url, userId) {
  const filter = { url, userId };
  const link = await this.findOne(filter);
  return !!link;
};

/**
 * @typedef Link
 */
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
