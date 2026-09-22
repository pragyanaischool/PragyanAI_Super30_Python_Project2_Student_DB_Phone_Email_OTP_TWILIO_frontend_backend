/* =========================================================
   PRAGYANAI STUDENT VERIFICATION PLATFORM
   VALIDATION UTILITIES
   ========================================================= */

import {
  FIELD_LIMITS,
  CGPA,
  OTP_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "./constants";

/*
|--------------------------------------------------------------------------
| GENERIC
|--------------------------------------------------------------------------
*/

export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  );
}

/*
|--------------------------------------------------------------------------
| REQUIRED
|--------------------------------------------------------------------------
*/

export function required(
  value,
  fieldName = "This field"
) {
  if (isEmpty(value)) {
    return `${fieldName} is required.`;
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| EMAIL
|--------------------------------------------------------------------------
*/

export function isValidEmail(
  email
) {
  if (isEmpty(email)) {
    return false;
  }

  const normalized =
    String(email)
      .trim()
      .toLowerCase();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    emailRegex.test(normalized) &&
    normalized.length <=
      FIELD_LIMITS.EMAIL.MAX
  );
}

export function validateEmail(
  email
) {
  if (isEmpty(email)) {
    return "Email address is required.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| PHONE
|--------------------------------------------------------------------------
*/

export function normalizePhone(
  phone
) {
  if (isEmpty(phone)) {
    return "";
  }

  return String(phone)
    .trim()
    .replace(/[()\s-]/g, "");
}

export function isValidPhone(
  phone
) {
  const normalized =
    normalizePhone(phone);

  /*
   * Allows:
   *
   * +919876543210
   * 919876543210
   * 9876543210
   */
  const phoneRegex =
    /^\+?[0-9]{10,15}$/;

  return phoneRegex.test(
    normalized
  );
}

export function validatePhone(
  phone
) {
  if (isEmpty(phone)) {
    return "Phone number is required.";
  }

  if (!isValidPhone(phone)) {
    return (
      "Please enter a valid phone number."
    );
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| NAME
|--------------------------------------------------------------------------
*/

export function validateName(
  name
) {
  if (isEmpty(name)) {
    return "Full name is required.";
  }

  const value =
    String(name).trim();

  if (
    value.length <
    FIELD_LIMITS.FULL_NAME.MIN
  ) {
    return "Name is too short.";
  }

  if (
    value.length >
    FIELD_LIMITS.FULL_NAME.MAX
  ) {
    return "Name is too long.";
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| COLLEGE
|--------------------------------------------------------------------------
*/

export function validateCollegeName(
  collegeName
) {
  if (isEmpty(collegeName)) {
    return "College name is required.";
  }

  const value =
    String(collegeName).trim();

  if (
    value.length <
    FIELD_LIMITS.COLLEGE_NAME.MIN
  ) {
    return "College name is too short.";
  }

  if (
    value.length >
    FIELD_LIMITS.COLLEGE_NAME.MAX
  ) {
    return "College name is too long.";
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| DEGREE
|--------------------------------------------------------------------------
*/

export function validateDegree(
  degree
) {
  if (isEmpty(degree)) {
    return "Degree is required.";
  }

  const value =
    String(degree).trim();

  if (
    value.length <
    FIELD_LIMITS.DEGREE.MIN
  ) {
    return "Degree is too short.";
  }

  if (
    value.length >
    FIELD_LIMITS.DEGREE.MAX
  ) {
    return "Degree is too long.";
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| BRANCH
|--------------------------------------------------------------------------
*/

export function validateBranch(
  branch
) {
  if (isEmpty(branch)) {
    return "Branch is required.";
  }

  const value =
    String(branch).trim();

  if (
    value.length <
    FIELD_LIMITS.BRANCH.MIN
  ) {
    return "Branch is too short.";
  }

  if (
    value.length >
    FIELD_LIMITS.BRANCH.MAX
  ) {
    return "Branch is too long.";
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| CGPA
|--------------------------------------------------------------------------
*/

export function isValidCGPA(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return true;
  }

  const numericValue =
    Number(value);

  return (
    Number.isFinite(
      numericValue
    ) &&
    numericValue >= CGPA.MIN &&
    numericValue <= CGPA.MAX
  );
}

export function validateCGPA(
  value,
  fieldName = "CGPA"
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  if (!isValidCGPA(value)) {
    return `${fieldName} must be between ${CGPA.MIN} and ${CGPA.MAX}.`;
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| PASSWORD
|--------------------------------------------------------------------------
*/

export function isValidPassword(
  password
) {
  if (
    typeof password !==
    "string"
  ) {
    return false;
  }

  return (
    password.length >=
      PASSWORD_MIN_LENGTH &&
    password.length <=
      PASSWORD_MAX_LENGTH
  );
}

export function validatePassword(
  password
) {
  if (isEmpty(password)) {
    return "Password is required.";
  }

  if (
    password.length <
    PASSWORD_MIN_LENGTH
  ) {
    return `Password must contain at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (
    password.length >
    PASSWORD_MAX_LENGTH
  ) {
    return `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters.`;
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| CONFIRM PASSWORD
|--------------------------------------------------------------------------
*/

export function validateConfirmPassword(
  password,
  confirmPassword
) {
  if (
    isEmpty(confirmPassword)
  ) {
    return "Please confirm your password.";
  }

  if (
    password !==
    confirmPassword
  ) {
    return "Passwords do not match.";
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| OTP
|--------------------------------------------------------------------------
*/

export function isValidOTP(
  otp
) {
  if (isEmpty(otp)) {
    return false;
  }

  const value =
    String(otp).trim();

  const otpRegex =
    new RegExp(
      `^[0-9]{${OTP_LENGTH}}$`
    );

  return otpRegex.test(value);
}

export function validateOTP(
  otp
) {
  if (isEmpty(otp)) {
    return "OTP is required.";
  }

  if (!isValidOTP(otp)) {
    return `OTP must contain exactly ${OTP_LENGTH} digits.`;
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| REGISTRATION FORM
|--------------------------------------------------------------------------
*/

export function validateRegistrationForm(
  formData
) {
  const errors = {};

  const nameError =
    validateName(
      formData.full_name
    );

  if (nameError) {
    errors.full_name =
      nameError;
  }

  const collegeError =
    validateCollegeName(
      formData.college_name
    );

  if (collegeError) {
    errors.college_name =
      collegeError;
  }

  const degreeError =
    validateDegree(
      formData.degree
    );

  if (degreeError) {
    errors.degree =
      degreeError;
  }

  const branchError =
    validateBranch(
      formData.branch
    );

  if (branchError) {
    errors.branch =
      branchError;
  }

  const emailError =
    validateEmail(
      formData.email
    );

  if (emailError) {
    errors.email =
      emailError;
  }

  const phoneError =
    validatePhone(
      formData.phone
    );

  if (phoneError) {
    errors.phone =
      phoneError;
  }

  const passwordError =
    validatePassword(
      formData.password
    );

  if (passwordError) {
    errors.password =
      passwordError;
  }

  const confirmPasswordError =
    validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

  if (confirmPasswordError) {
    errors.confirmPassword =
      confirmPasswordError;
  }

  const tenthError =
    validateCGPA(
      formData.tenth_cgpa,
      "10th CGPA"
    );

  if (tenthError) {
    errors.tenth_cgpa =
      tenthError;
  }

  const twelfthError =
    validateCGPA(
      formData.twelfth_cgpa,
      "12th CGPA"
    );

  if (twelfthError) {
    errors.twelfth_cgpa =
      twelfthError;
  }

  const beError =
    validateCGPA(
      formData.be_cgpa,
      "BE CGPA"
    );

  if (beError) {
    errors.be_cgpa =
      beError;
  }

  return errors;
}

/*
|--------------------------------------------------------------------------
| LOGIN FORM
|--------------------------------------------------------------------------
*/

export function validateLoginForm(
  formData
) {
  const errors = {};

  const emailError =
    validateEmail(
      formData.email
    );

  if (emailError) {
    errors.email =
      emailError;
  }

  const passwordError =
    validatePassword(
      formData.password
    );

  if (passwordError) {
    errors.password =
      passwordError;
  }

  return errors;
}

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

export function validateAdminLoginForm(
  formData
) {
  const errors = {};

  const emailError =
    validateEmail(
      formData.email
    );

  if (emailError) {
    errors.email =
      emailError;
  }

  if (
    isEmpty(formData.password)
  ) {
    errors.password =
      "Password is required.";
  }

  return errors;
}

/*
|--------------------------------------------------------------------------
| CHECK FORM HAS ERRORS
|--------------------------------------------------------------------------
*/

export function hasValidationErrors(
  errors
) {
  return (
    Object.keys(errors).length >
    0
  );
}
