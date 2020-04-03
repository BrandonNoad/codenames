const baseColors = {
    transparent: 'transparent',
    white: '#fff',
    black: '#000'
};

const colorPalettes = {
    redPalette: ['#BA2525', '#A61B1B', '#911111'],

    bluePalette: ['#2680C2', '#186FAF', '#0F609B'],

    yellowPalette: ['#FCEFC7', '#F8E3A3', '#F9DA8B'],

    warmGreyPalette: ['#D3CEC4', '#B8B2A7', '#A39E93'],

    greyPalette: [
        '#F7F7F7',
        '#E1E1E1',
        '#CFCFCF',
        '#B1B1B1',
        '#9E9E9E',
        '#7E7E7E',
        '#626262',
        '#515151',
        '#3B3B3B',
        '#222222',
        '#111111'
    ]
};

const commonButtonStyles = {
    py: 2,
    px: 3,
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: 'default',
    borderRadius: 'default'
};

const theme = {
    breakpoints: ['640px', '768px', '1024px', '1280px'],

    // text - body color
    // background - body background color
    // primary - primary button and link color
    // secondary - secondary color; can be used for hover states
    // accent - a contrast color for emphasizing UI
    // highlight - a background color for highlighting text
    // muted - a gray or subdued color for decorative purposes
    colors: {
        ...baseColors,
        ...colorPalettes,
        text: colorPalettes.greyPalette[8],
        background: baseColors.white,
        primary: colorPalettes.greyPalette[9],
        hover: colorPalettes.greyPalette[10],
        secondary: colorPalettes.greyPalette[9],
        accent: colorPalettes.greyPalette[1],
        highlight: colorPalettes.greyPalette[1],
        muted: colorPalettes.greyPalette[1],
        modes: {
            red: {
                primary: colorPalettes.redPalette[0],
                hover: colorPalettes.redPalette[1]
            },
            blue: {
                primary: colorPalettes.bluePalette[0],
                hover: colorPalettes.bluePalette[1]
            }
        }
    },

    fonts: {
        body:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        heading: 'inherit',
        monospace: 'Menlo, monospace'
    },
    fontSizes: [
        '0.875rem',
        '1rem',
        '1.25rem',
        '1.5rem',
        '1.875rem',
        '2.25rem',
        '3rem',
        '4rem',
        '4.5rem'
    ],
    fontWeights: {
        body: 400,
        semibold: 600,
        heading: 700,
        bold: 700
    },
    letterSpacings: {
        body: 'normal',
        uppercase: '0.02em'
    },
    lineHeights: {
        body: 1.5,
        heading: 1.125
    },
    radii: {
        none: 0,
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '50%'
    },
    shadows: {
        none: 'none',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    space: [0, '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem'],

    // To add base, top-level styles to the <body> element, use theme.styles.root.
    styles: {
        root: {
            fontFamily: 'body',
            fontWeight: 'body',
            lineHeight: 'body'
        }
    },

    // -- Variants
    // https://github.com/system-ui/theme-ui/blob/master/packages/preset-tailwind/src/index.ts

    buttons: {
        primary: {
            ...commonButtonStyles,
            backgroundColor: 'primary',
            color: 'white',
            '&:hover': {
                color: '#dedede'
            }
        },
        outline: {
            ...commonButtonStyles,
            backgroundColor: 'transparent',
            color: 'primary',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'primary',
            '&:hover': {
                backgroundColor: 'primary',
                color: 'white',
                borderColor: 'transparent'
            }
        }
    },
    cards: {
        primary: {
            p: 3,
            borderRadius: 'default',
            boxShadow: 'default'
        }
    },
    text: {
        heading: {
            fontFamily: 'heading',
            fontWeight: 'heading',
            lineHeight: 'heading'
        },
        uppercase: {
            letterSpacing: 'uppercase',
            textTransform: 'uppercase'
        }
    }
};

export default theme;
