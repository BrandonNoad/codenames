import React from 'react';
import { Card, Text } from 'theme-ui';
import _get from 'lodash/get';

const getCommonCardProps = () => ({ p: 3, sx: { textAlign: 'center' } });

const getAgentCardStripeColors = (secretIdentity) => {
    if (secretIdentity === 'redAgent') {
        return ['redPalette.0', 'redPalette.1', 'redPalette.2'];
    }

    if (secretIdentity === 'blueAgent') {
        return ['bluePalette.0', 'bluePalette.1', 'bluePalette.2'];
    }

    if (secretIdentity === 'innocentBystander') {
        return ['warmGreyPalette.0', 'warmGreyPalette.1', 'warmGreyPalette.2'];
    }

    // assassin
    return ['greyPalette.9', 'greyPalette.10', 'black'];
};

const CardText = ({ text }) => (
    <Text
        variant="uppercase"
        sx={{
            fontWeight: 'semibold',
            fontSize: 2,
            display: 'inline-block'
        }}
    >
        {text}
    </Text>
);

// Cards all players see after they have been guessed.
export const AgentCard = ({ secretIdentity, text = '', borderBottom = 'none' }) => {
    const { sx, ...rest } = getCommonCardProps();

    const [lightStripe, mediumStripe, darkStripe] = getAgentCardStripeColors(secretIdentity);

    return (
        <Card
            {...rest}
            sx={{
                ...sx,
                color: secretIdentity === 'innocentBystander' ? 'greyPalette.8' : 'white',
                borderBottom,
                borderBottomColor: darkStripe,
                background: (theme) => `repeating-linear-gradient(
                    45deg,
                    ${_get(theme.colors, lightStripe)},
                    ${_get(theme.colors, lightStripe)} 10px,
                    ${_get(theme.colors, mediumStripe)} 10px,
                    ${_get(theme.colors, mediumStripe)} 20px
                )`,
                '&:hover': {
                    background: (theme) => `repeating-linear-gradient(
                        45deg,
                        ${_get(theme.colors, mediumStripe)},
                        ${_get(theme.colors, mediumStripe)} 10px,
                        ${_get(theme.colors, darkStripe)} 10px,
                        ${_get(theme.colors, darkStripe)} 20px
                    )`
                }
            }}
        >
            {text ? <CardText text={text}></CardText> : <CardText text="&nbsp;"></CardText>}
        </Card>
    );
};

export const AgentCardPile = ({ secretIdentity, numCards }) => {
    return (
        <AgentCard
            secretIdentity={secretIdentity}
            borderBottom={`${numCards - 1}px solid`}
            text={numCards}
        />
    );
};

// Cards the Field Operatives see before they have been guessed.
const CodenameCard = ({ isYourTurn, codename, onGuess }) => {
    const { sx, ...rest } = getCommonCardProps();

    return (
        <Card
            {...rest}
            sx={{
                ...sx,
                cursor: isYourTurn ? 'pointer' : 'default',
                color: 'greyPalette.8',
                backgroundColor: 'yellowPalette.0',
                '&:hover': {
                    backgroundColor: 'yellowPalette.1'
                }
            }}
            onDoubleClick={isYourTurn ? onGuess : () => {}}
        >
            <CardText text={codename}></CardText>
        </Card>
    );
};

const getKeyCardColors = (secretIdentity) => {
    if (secretIdentity === 'redAgent') {
        return ['white', 'redPalette.0', 'redPalette.1'];
    }

    if (secretIdentity === 'blueAgent') {
        return ['white', 'bluePalette.0', 'bluePalette.1'];
    }

    if (secretIdentity === 'innocentBystander') {
        return ['greyPalette.8', 'warmGreyPalette.0', 'warmGreyPalette.1'];
    }

    // assassin
    return ['white', 'greyPalette.9', 'black'];
};

const KeyCard = ({ codename, secretIdentity }) => {
    const { sx, ...rest } = getCommonCardProps();

    const [color, backgroundColor, hoverBackgroundColor] = getKeyCardColors(secretIdentity);

    return (
        <Card
            {...rest}
            sx={{
                ...sx,
                color,
                backgroundColor,
                '&:hover': {
                    backgroundColor: hoverBackgroundColor
                }
            }}
        >
            <CardText text={codename}></CardText>
        </Card>
    );
};

const PlayingCard = ({
    role,
    isYourTurn,
    codename,
    isIdentityRevealed,
    secretIdentity,
    onGuess
}) => {
    if (isIdentityRevealed) {
        return <AgentCard secretIdentity={secretIdentity} />;
    }

    if (role === 'operative') {
        return <CodenameCard isYourTurn={isYourTurn} codename={codename} onGuess={onGuess} />;
    }

    return <KeyCard codename={codename} secretIdentity={secretIdentity} />;
};

export default PlayingCard;
