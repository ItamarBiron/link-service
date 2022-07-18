const mongoose = require('mongoose');
const faker = require('faker');
const Link = require('../../src/models/link.model');
const { admin, userOne } = require('./user.fixture');

const adminLink = {
  _id: mongoose.Types.ObjectId(),
  url: 'https://google.com',
  name: faker.random.word(),
  userId: admin._id,
  metadata: { metadata: { test: 5 } },
};

const userLink = {
  _id: mongoose.Types.ObjectId(),
  url: 'https://facebook.com',
  name: faker.random.word(),
  userId: userOne._id,
  metadata: { metadata: { test: 5 } },
};

const insertLinks = async (links) => {
  await Link.insertMany(links);
};

module.exports = {
  adminLink,
  userLink,
  insertLinks,
};
