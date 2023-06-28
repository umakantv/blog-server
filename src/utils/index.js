const { default: slugify } = require("slugify");

function createSlug(title) {
    return slugify(title, {
        lower: true,
        strict: true,
    })
}

module.exports = {
    createSlug,
}