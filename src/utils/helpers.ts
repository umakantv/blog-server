const defaultSecureFields = ["password", "verifyOtp", "resetPasswordOtp"];

export function isObject(val: any): boolean {
  if (typeof val === "object" && !Array.isArray(val) && val !== null) {
    return true;
  }
  return false;
}

export function checkObjectHasSecureFieldsRecursively(
  obj: any,
  secureFields = defaultSecureFields
): boolean {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (checkObjectHasSecureFieldsRecursively(item)) {
        return true;
      }
    }
  } else if (isObject(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      if (secureFields.includes(key)) {
        return true;
      }
      if (checkObjectHasSecureFieldsRecursively(value)) {
        return true;
      }
    }
  }

  return false;
}
