'use strict';

const path = require('path');

// If .env.development is missing (e.g production), this will fail silently.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.development') });

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const Airtable = require('airtable');

exports.handler = async (event, context) => {
    try {
        // -- Check HTTP method.

        if (event.httpMethod !== 'GET') {
            throw Boom.methodNotAllowed();
        }

        // -- Validate query.

        const idSchema = Joi.number()
            .integer()
            .positive()
            .required();

        const querySchema = Joi.object({
            gameId: idSchema,
            role: Joi.string()
                .trim()
                .lowercase()
                .valid('spymaster', 'operative')
                .required()
        });

        const { error: queryError, value: query } = querySchema.validate(
            event.queryStringParameters
        );

        if (queryError !== undefined) {
            throw Boom.boomify(queryError, { statusCode: 400 });
        }

        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
            process.env.AIRTABLE_API_BASE_ID
        );

        const results = await base('games')
            .select({ filterByFormula: `{id} = ${query.gameId}` })
            .firstPage();

        if (results.length !== 1) {
            throw new Error('Bad Implementation!');
        }

        const result = results[0];

        const { turn, cards } = JSON.parse(result.fields.meta);

        const game = {
            id: result.fields.id,
            turn,
            cards:
                query.role === 'spymaster'
                    ? cards
                    : cards.map((card) => ({
                          ...card,
                          secretIdentity: card.isIdentityRevealed ? card.secretIdentity : null
                      }))
        };

        return {
            statusCode: 200,
            body: JSON.stringify(game)
        };
    } catch (err) {
        if (Boom.isBoom(err)) {
            return {
                statusCode: err.output.statusCode,
                body: JSON.stringify(err.output.payload)
            };
        }

        // Re-throw error.
        throw err;
    }
};
