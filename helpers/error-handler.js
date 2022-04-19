function getError(err) {

    if (process.env.NODE_ENV === "production") {
        return "Some error occurred, please try again later.";
    }

    return err.message;
}

module.exports = {
    getError
};