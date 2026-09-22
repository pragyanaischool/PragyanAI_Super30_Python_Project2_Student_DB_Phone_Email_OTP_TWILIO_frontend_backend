import api from "./api";

/*
|--------------------------------------------------------------------------
| STUDENT REGISTRATION
|--------------------------------------------------------------------------
|
| POST /api/auth/register
|
*/

export async function registerStudent(
  studentData
) {
  try {
    const payload = {
      full_name:
        studentData.full_name?.trim(),

      college_name:
        studentData.college_name?.trim(),

      degree:
        studentData.degree?.trim(),

      branch:
        studentData.branch?.trim(),

      tenth_cgpa:
        studentData.tenth_cgpa === "" ||
        studentData.tenth_cgpa === null ||
        studentData.tenth_cgpa === undefined
          ? null
          : Number(studentData.tenth_cgpa),

      twelfth_cgpa:
        studentData.twelfth_cgpa === "" ||
        studentData.twelfth_cgpa === null ||
        studentData.twelfth_cgpa === undefined
          ? null
          : Number(studentData.twelfth_cgpa),

      be_cgpa:
        studentData.be_cgpa === "" ||
        studentData.be_cgpa === null ||
        studentData.be_cgpa === undefined
          ? null
          : Number(studentData.be_cgpa),

      phone:
        studentData.phone?.trim(),

      email:
        studentData.email
          ?.trim()
          .toLowerCase(),

      password:
        studentData.password,
    };

    const response = await api.post(
      "/auth/register",
      payload
    );

    /*
     * If backend returns a token,
     * save it automatically.
     */
    if (response.data?.access_token) {
      localStorage.setItem(
        "student_token",
        response.data.access_token
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| STUDENT LOGIN
|--------------------------------------------------------------------------
|
| POST /api/auth/login
|
*/

export async function loginStudent(
  email,
  password
) {
  try {
    const response = await api.post(
      "/auth/login",
      {
        email:
          email.trim().toLowerCase(),

        password,
      }
    );

    /*
     * Save JWT token.
     */
    if (response.data?.access_token) {
      localStorage.setItem(
        "student_token",
        response.data.access_token
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| STUDENT LOGOUT
|--------------------------------------------------------------------------
*/

export function logoutStudent() {
  localStorage.removeItem(
    "student_token"
  );

  /*
   * Remove temporary registration
   * information as well.
   */
  localStorage.removeItem(
    "registration_email"
  );

  localStorage.removeItem(
    "registration_phone"
  );

  localStorage.removeItem(
    "registration_student_id"
  );

  window.location.href = "/login";
}

/*
|--------------------------------------------------------------------------
| CHECK STUDENT LOGIN
|--------------------------------------------------------------------------
*/

export function isStudentLoggedIn() {
  return Boolean(
    localStorage.getItem(
      "student_token"
    )
  );
}

/*
|--------------------------------------------------------------------------
| GET STUDENT TOKEN
|--------------------------------------------------------------------------
*/

export function getStudentToken() {
  return localStorage.getItem(
    "student_token"
  );
}

/*
|--------------------------------------------------------------------------
| GET CURRENT STUDENT
|--------------------------------------------------------------------------
|
| GET /api/auth/me
|
*/

export async function getCurrentStudent() {
  try {
    const response = await api.get(
      "/auth/me"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| CHECK AUTHENTICATION
|--------------------------------------------------------------------------
|
| Useful for AuthContext.
|
*/

export async function checkStudentAuthentication() {
  try {
    const token =
      localStorage.getItem(
        "student_token"
      );

    if (!token) {
      return {
        authenticated: false,
        student: null,
      };
    }

    const student =
      await getCurrentStudent();

    return {
      authenticated: true,
      student,
    };
  } catch (error) {
    localStorage.removeItem(
      "student_token"
    );

    return {
      authenticated: false,
      student: null,
    };
  }
}

/*
|--------------------------------------------------------------------------
| CLEAR STUDENT TOKEN
|--------------------------------------------------------------------------
*/

export function clearStudentToken() {
  localStorage.removeItem(
    "student_token"
  );
}

/*
|--------------------------------------------------------------------------
| STORE REGISTRATION INFORMATION
|--------------------------------------------------------------------------
|
| Used during:
|
| Register
|    ↓
| Email OTP
|    ↓
| Phone OTP
|
*/

export function storeRegistrationInfo(
  data
) {
  if (data?.email) {
    localStorage.setItem(
      "registration_email",
      data.email
    );
  }

  if (data?.phone) {
    localStorage.setItem(
      "registration_phone",
      data.phone
    );
  }

  if (data?.student_id) {
    localStorage.setItem(
      "registration_student_id",
      String(data.student_id)
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET REGISTRATION EMAIL
|--------------------------------------------------------------------------
*/

export function getRegistrationEmail() {
  return localStorage.getItem(
    "registration_email"
  );
}

/*
|--------------------------------------------------------------------------
| GET REGISTRATION PHONE
|--------------------------------------------------------------------------
*/

export function getRegistrationPhone() {
  return localStorage.getItem(
    "registration_phone"
  );
}

/*
|--------------------------------------------------------------------------
| GET REGISTRATION STUDENT ID
|--------------------------------------------------------------------------
*/

export function getRegistrationStudentId() {
  return localStorage.getItem(
    "registration_student_id"
  );
}

/*
|--------------------------------------------------------------------------
| CLEAR REGISTRATION INFORMATION
|--------------------------------------------------------------------------
*/

export function clearRegistrationInfo() {
  localStorage.removeItem(
    "registration_email"
  );

  localStorage.removeItem(
    "registration_phone"
  );

  localStorage.removeItem(
    "registration_student_id"
  );
}
