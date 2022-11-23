const NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv')
.config({
    path: `./environment/.env.${NODE_ENV}`
})

const PORT = process.env.PORT || 3050;
const JWT_SECRET = process.env.JWT_SECRET;
const DB_CONNECTTION_STRING = process.env.DB_CONNECTTION_STRING;
const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;

module.exports = {
    NODE_ENV,
    PORT,
    JWT_SECRET,
    DB_CONNECTTION_STRING,
    GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET,
};