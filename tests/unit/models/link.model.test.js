const faker = require('faker');
const { Link } = require('../../../src/models');

describe('Link model', () => {
  describe('Link validation', () => {
    let newLink;
    beforeEach(() => {
      newLink = {
        name: faker.name.findName(),
        url: faker.internet.url(),
        userId: faker.random.word(),
        metadata: { random: faker.random.word() },
      };
    });

    test('should correctly validate a valid link', async () => {
      await expect(new Link(newLink).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if url is invalid', async () => {
      newLink.url = 'invalidUrl';
      await expect(new Link(newLink).validate()).rejects.toThrow();
    });
  });
});
