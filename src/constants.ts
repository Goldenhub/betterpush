export const RedisKeys = {
  RefreshToken: "auth:refresh",
  OneTimePassword: "auth:otp",
  VerificationCode: "auth:verification",
};

export const OTP_EXPIRATION = 5 * 60; // 5 minutes

export const SECONDS_IN_A_DAY = 24 * 60 * 60;

/* Regex:
  ^               - start of the string
  (?=.*[a-z])     - at least one lowercase letter
  (?=.*[A-Z])     - at least one uppercase letter
  (?=.*\d)        - at least one number
  (?=.*[^a-zA-Z\d]) - at least one special character (not a letter or number)
  .{6,}           - at least 6 characters long
  $               - end of the string
*/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;

export const monthMap: Record<string, string> = {
  "1": "jan",
  "2": "feb",
  "3": "mar",
  "4": "apr",
  "5": "may",
  "6": "jun",
  "7": "jul",
  "8": "aug",
  "9": "sep",
  "10": "oct",
  "11": "nov",
  "12": "dec",
};

export const Permissions = {
  load: ["create", "read", "view", "update", "delete", "assign", "accept", "manage"],
  loadAssignmentToCarrier: ["create", "read", "view", "update", "delete", "accept", "manage"],
  driverAssignmentToTruck: ["create", "read", "view", "update", "delete", "accept", "manage"],
  loadAssignmentToTruck: ["create", "read", "view", "update", "delete", "accept", "manage"],
  statusUpdate: ["create", "read", "view", "update", "manage"],
  inspection: ["create", "read", "view", "update", "delete", "manage"],
  document: ["create", "read", "view", "update", "delete", "manage"],
  driversDirectory: ["create", "read", "view", "update", "delete", "manage"],
  truckAndFleet: ["create", "read", "view", "update", "delete", "manage"],
  rating: ["create", "read", "view", "manage"],
  accountsAndVerification: ["create", "read", "view", "update", "delete", "manage"],
  payments: ["create", "read", "view", "manage"],
  loadBoard: ["view"],
};
