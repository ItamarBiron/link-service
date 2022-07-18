const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Link } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { adminLink, userLink, insertLinks } = require('../fixtures/link.fixture');

setupTestDB();

describe('Links routes', () => {
  describe('POST /v1/links', () => {
    let newLink;

    beforeEach(() => {
      newLink = {
        name: faker.name.findName(),
        url: 'https://google.com',
      };
    });

    test('should return 201 and successfully create new link if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/links')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newLink)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        _id: expect.anything(),
        name: newLink.name,
        url: newLink.url,
        userId: expect.anything(),
        metadata: expect.anything(),
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbLink = await Link.findById(res.body._id);
      expect(dbLink).toBeDefined();
      // convert to json object because mongo object is different
      expect(dbLink.toJSON()).toMatchObject({
        _id: expect.anything(),
        name: res.body.name,
        url: res.body.url,
        userId: res.body.userId,
        __v: res.body.__v,
        createdAt: new Date(res.body.createdAt),
        updatedAt: new Date(res.body.updatedAt),
        metadata: expect.anything(),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/links').send(newLink).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if url is invalid', async () => {
      await insertUsers([admin]);
      newLink.url = 'invalidUrl';

      await request(app)
        .post('/v1/links')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newLink)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if url is already used for the current user', async () => {
      // associate link with admin user
      await insertUsers([admin]);
      await insertLinks([adminLink]);

      // only the url remain the same
      const apiLink = { name: faker.random.word(), url: adminLink.url };

      await request(app)
        .post('/v1/links')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(apiLink)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 201, insert link with same url for other user', async () => {
      await insertUsers([admin]);

      // insert random url link with user userId
      await insertLinks([userLink]);

      // create new object, change only user id
      const apiLink = { url: userLink.url, name: userLink.name };

      // insert same link for other user
      await request(app)
        .post('/v1/links')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(apiLink)
        .expect(httpStatus.CREATED);
    });

    describe('GET /v1/links', () => {
      test('should return 200 and apply the default query options', async () => {
        await insertUsers([admin]);
        await insertLinks([adminLink]);

        const res = await request(app)
          .get('/v1/links')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toHaveLength(1);
        const firstLink = res.body[0];
        expect(firstLink).toEqual({
          _id: expect.anything(),
          url: adminLink.url,
          name: adminLink.name,
          userId: String(adminLink.userId),
          metadata: expect.anything(),
          __v: firstLink.__v,
          createdAt: firstLink.createdAt,
          updatedAt: firstLink.updatedAt,
        });
      });

      describe('DELETE /v1/links/:linkId', () => {
        test('should return 404 error if link already is not found', async () => {
          await insertUsers([admin]);

          const fakeLinkId = admin._id;
          await request(app)
            .delete(`/v1/links/${fakeLinkId}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send()
            .expect(httpStatus.NOT_FOUND);
        });

        test('should return 400 error if id is not valid mongo id', async () => {
          await insertUsers([admin]);

          const fakeLinkId = 'fakeId';
          await request(app)
            .delete(`/v1/links/${fakeLinkId}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send()
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('PATCH /v1/links/:linkId', () => {
        test('should return 200 and successfully update user link if data is ok', async () => {
          await insertUsers([userOne]);
          await insertLinks([userLink]);
          const updateBody = {
            name: faker.name.findName(),
            url: 'https://youtube.com',
          };

          const res = await request(app)
            .patch(`/v1/links/${userLink._id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(updateBody)
            .expect(httpStatus.OK);

          expect(res.body).toEqual({
            _id: expect.anything(),
            url: updateBody.url,
            name: updateBody.name,
            userId: String(userLink.userId),
            metadata: expect.anything(),
            __v: res.body.__v,
            createdAt: res.body.createdAt,
            updatedAt: res.body.updatedAt,
          });
        });
      });
    });
  });
});
