// Applied to every schema so API responses always have a reliable, plain
// string `id` field (instead of depending on Mongoose's default `id`
// virtual, which the frontend was finding to be undefined). Also strips the
// internal `_id` ObjectId and the `__v` version key, since the frontend
// never needs them.
function applyIdTransform(schema) {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  });
  schema.set("toObject", {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  });
}

module.exports = applyIdTransform;
