'use strict';

const path = require('path');

// If .env.development is missing (e.g production), this will fail silently.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.development') });

const Boom = require('@hapi/boom');
const Airtable = require('airtable');

const getRandomIntInclusive = ({ min = 0, max }) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const generateSecretIdentities = (startingTeam) => {
    const counts = {
        redAgent: startingTeam === 'red' ? 9 : 8,
        blueAgent: startingTeam === 'blue' ? 9 : 8,
        innocentBystander: 7,
        assassin: 1
    };

    let numIdentitiesToAssign = 25;

    const results = [];

    while (numIdentitiesToAssign > 0) {
        const randomNumber = getRandomIntInclusive({ max: 24 });

        if (results[randomNumber] === undefined) {
            if (counts.redAgent > 0) {
                results[randomNumber] = 'redAgent';
                counts.redAgent -= 1;
            } else if (counts.blueAgent > 0) {
                results[randomNumber] = 'blueAgent';
                counts.blueAgent -= 1;
            } else if (counts.innocentBystander > 0) {
                results[randomNumber] = 'innocentBystander';
                counts.innocentBystander -= 1;
            } else {
                results[randomNumber] = 'assassin';
                counts.assassin -= 1;
            }

            numIdentitiesToAssign -= 1;
        }
    }

    return results;
};

exports.handler = async (event, context) => {
    try {
        // -- Check HTTP method.

        if (event.httpMethod !== 'POST') {
            throw Boom.methodNotAllowed();
        }

        const startingTeam = Date.now() % 2 === 0 ? 'red' : 'blue';

        const NUM_WORDS = 403;

        const wordNumbers = [];

        while (wordNumbers.length < 25) {
            const randomNumber = getRandomIntInclusive({ min: 1, max: NUM_WORDS });

            if (wordNumbers.indexOf(randomNumber) < 0) {
                wordNumbers.push(randomNumber);
            }
        }

        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
            process.env.AIRTABLE_API_BASE_ID
        );

        const results = await base('words')
            .select({
                fields: ['word'],
                filterByFormula: `OR(${wordNumbers.map((n) => `{id} = ${n}`).join(',')})`
            })
            .firstPage();

        if (results.length !== 25) {
            throw new Error('Bad Implementation!');
        }

        const secretIdentities = generateSecretIdentities(startingTeam);

        const meta = {
            startingTeam,
            turn: startingTeam,
            cards: results.map((result, idx) => {
                const { word } = result.fields;

                return {
                    codename: word,
                    secretIdentity: secretIdentities[idx],
                    isIdentityRevealed: false
                };
            })
        };

        const result = await base('games').create({ meta: JSON.stringify(meta) });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: result.fields.id })
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
