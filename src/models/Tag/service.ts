import tagModel from "./repo";

export async function searchTags(substring: string) {
  let tags = await tagModel
    .find({
      name: {
        $regex: substring,
      },
    })
    .limit(5);

  return tags;
}

export async function addTags(tags: string[]) {
  if (tags.length < 1) return;

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
