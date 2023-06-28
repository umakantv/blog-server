const userModel = require("../database/user.model");
const AppError = require("../utils/AppError");

async function findByIdOrFail(id) {
    let user = await  userModel.findById(id);

    if (!user) {
        throw new AppError('User with the given id does not exist.')
    }
    user = user.toJSON()
    delete user.password;

    return user;
}

module.exports = {
    findByIdOrFail,
}