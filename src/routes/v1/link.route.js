const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const linkValidation = require('../../validations/link.validation');
const linkController = require('../../controllers/link.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('manageLinks'), validate(linkValidation.getLinks), linkController.getLinks)
  .post(auth('manageLinks'), validate(linkValidation.createLink), linkController.createLink);

router
  .route('/:linkId')
  .patch(auth('manageLinks'), validate(linkValidation.updateLink), linkController.updateLink)
  .delete(auth('manageLinks'), validate(linkValidation.deleteLink), linkController.deleteLink);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Links
 *   description: Links management and retrieval
 */

/**
 * @swagger
 * /links:
 *   post:
 *     summary: Create new link
 *     description: create new link for current user.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *               name:
 *                 type: string
 *             example:
 *               url: https://google.com
 *               name: search site

 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Link'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all links
 *     description: Get all current user links.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Link'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
 * @swagger
 * /links/{id}:
 *   patch:
 *     summary: Update a Link
 *     description: Update user link.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Link id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *                 description: must be unique
 *             example:
 *               name: social network
 *               url: https://facebook.com
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Link'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a link
 *     description: Logged in users can delete there links.
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Link id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
