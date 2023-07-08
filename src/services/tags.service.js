const { createSlug } = require("../utils");
const tagModel = require("../database/tag.model");

async function searchTags(substring) {
  let tags = await tagModel
    .find({
      name: {
        $regex: substring,
      },
    })
    .limit(5);

  return tags;
}

async function addTags(tags) {
  if (tags.size < 1) return;

  let existingTags = await tagModel.find({
    name: {
      $in: tags,
    },
  });

  let existingTagsSet = new Set(existingTags.map((tag) => tag.name));

  let nonExistingTags = tags.filter((name) => !existingTagsSet.has(name));
  nonExistingTags = Array.from(new Set(nonExistingTags));

  await tagModel.create(
    nonExistingTags.map((name) => ({
      name,
      followerCount: 1, // tag will be created after someone adds a new tag in their post, we assume they want to follow this tag
    }))
  );
}

module.exports = {
  searchTags,
  addTags,
};
