import { Token, TokenType } from '@/stores/useTokenStore';

/**
 * Generates utility class like CSS string.
 * Example:
 * :root {
 *   --primary-500: #3b82f6;
 *   --spacing-4: 1rem;
 * }
 */
export const generateCssVariables = (tokens: Token[]): string => {
    const groupedTokens: Record<TokenType, Token[]> = {
        color: [],
        typography: [],
        spacing: [],
        borderRadius: [],
        shadow: [],
    };

    // Group tokens by type for better readability
    tokens.forEach(token => {
        if (groupedTokens[token.type]) {
            groupedTokens[token.type].push(token);
        }
    });

    let css = ':root {\n';

    // Helper to append tokens
    const appendSection = (type: TokenType, label: string) => {
        const sectionTokens = groupedTokens[type];
        if (sectionTokens.length > 0) {
            css += `  /* ${label} */\n`;
            sectionTokens.forEach(token => {
                // Handle value formatting if needed (e.g. adding 'px' if user forgot)
                // For now, we assume raw value is correct
                css += `  --${token.id}: ${token.value};\n`;
            });
            css += '\n';
        }
    };

    appendSection('color', 'Colors');
    appendSection('spacing', 'Spacing');
    appendSection('typography', 'Typography');
    appendSection('borderRadius', 'Border Radius');
    appendSection('shadow', 'Shadows');

    css += '}';

    return css;
};
