import chroma from 'chroma-js';

export interface ColorScale {
    [key: number]: string;
}

export interface GeneratedToken {
    name: string;
    value: string;
}

/**
 * Generates a 10-step color scale based on a single hex color.
 * Uses chroma-js to create a smooth gradient from light to dark.
 */
export const generateColorScale = (baseColor: string): ColorScale => {
    if (!chroma.valid(baseColor)) {
        return {};
    }

    // Create a scale: Lightest -> Base -> Darkest
    // We use the base color as the '500' midpoint usually, 
    // but to get a full range we scale from a very light tint to a very dark shade.

    const scale = chroma.scale([
        chroma(baseColor).brighten(2.5), // 50
        baseColor,                       // 500 (approx)
        chroma(baseColor).darken(3)      // 900
    ]).mode('lch').colors(10); // LCH mode usually produces better gradients than RGB

    const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const result: ColorScale = {};

    stops.forEach((stop, index) => {
        result[stop] = scale[index];
    });

    return result;
};

/**
 * Helper to generate token objects for the store
 */
export const generateScaleTokens = (baseColor: string, namePrefix: string): GeneratedToken[] => {
    const scale = generateColorScale(baseColor);
    return Object.entries(scale).map(([stop, value]) => ({
        name: `${namePrefix} ${stop}`,
        value: value,
    }));
};
