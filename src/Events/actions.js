export const getActions = (meta) => [
    [/\/?textToImage\("([^"]*)"(?:,\s*"([^"]*)")?\)/, async (match) => {
        const description = match[1].trim();
        const size = match[2] || "1024x1024";

        // Validate size parameter
        const validSizes = ["1024x1024", "1536x1024", "1024x1536", "auto"];
        const imageSize = validSizes.includes(size) ? size : "1024x1024";

        const image = await openkbs.generateImage(description, {
            n: 1,
            size: imageSize,
            quality: "high"
        });
        const imageSrc = `data:image/png;base64,${image[0].b64_json}`;
        return { type: 'SAVED_CHAT_IMAGE', imageSrc, ...meta };
    }],
    [/\/?webpageToText\("(.*)"\)/, async (match) => {
        try {
            let response = await openkbs.webpageToText(match[1], { parsePrice: true });
            if (response?.content?.length > 5000) response.content = response.content.substring(0, 5000);
            return { data: response, ...meta };
        } catch (e) {
            return { error: e.response.data, ...meta };
        }
    }]
];