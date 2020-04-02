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

        if (event.httpMethod !== 'POST') {
            throw Boom.methodNotAllowed();
        }

        // -- Validate body.

        const idSchema = Joi.number()
            .integer()
            .positive()
            .required();

        const bodySchema = Joi.object({
            gameId: idSchema,
            codename: Joi.string()
                .trim()
                .lowercase()
                .required()
        });

        const { error: bodyError, value: body } = bodySchema.validate(JSON.parse(event.body));

        if (bodyError !== undefined) {
            throw Boom.boomify(bodyError, { statusCode: 400 });
        }

        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
            process.env.AIRTABLE_API_BASE_ID
        );

        const results = await base('games')
            .select({ filterByFormula: `{id} = ${body.gameId}` })
            .firstPage();

        if (results.length !== 1) {
            throw new Error('Bad Implementation!');
        }

        const fetchResult = results[0];

        const meta = JSON.parse(fetchResult.fields.meta);

        const searchString = body.codename.toLowerCase();

        const match = meta.cards.find((card) => card.codename.toLowerCase() === searchString);

        match.isIdentityRevealed = true;

        await base('games').update(fetchResult.id, {
            meta: JSON.stringify(meta)
        });

        return {
            statusCode: 200,
            body: 'success'
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
