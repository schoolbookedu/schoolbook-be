exports.removeFields = (fields, body) => {
    if (fields.length) {
        fields.forEach((element) => delete body[element]);
    }
};