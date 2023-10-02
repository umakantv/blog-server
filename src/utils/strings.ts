import slugify from "slugify";

export function createSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
  });
}

/**
 * evaluateString replaces the template keywords in your string
 *
 * `{{key_in_the_data_object}}` -> `value_of_the_key`
 *
 * * Use only the lower case keys in template
 */
export function evaluateString(
  string: string = "",
  data: object = {},
  strict = true
) {
  Object.entries(data).forEach(([key, value]) => {
    key = key.toLocaleLowerCase();
    let found = false;
    while (string.search(`{{${key}}}`) !== -1) {
      found = true;
      string = string.replace(`{{${key}}}`, value);
    }
    if (strict && found == false) {
      throw new Error(`Key '${key}' was not found in the string.`);
    }
  });
  return string;
}

export function generateOTP(length = 6) {
  let charset = "0123456789";

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += charset[Math.floor(Math.random() * charset.length)];
  }
  return otp;
}
