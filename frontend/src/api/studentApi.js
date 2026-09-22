import api from "./api";

/*
|--------------------------------------------------------------------------
| GET CURRENT STUDENT PROFILE
|--------------------------------------------------------------------------
|
| GET /api/students/me
|
*/

export async function getMyProfile() {
  try {
    const response = await api.get(
      "/students/me"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE CURRENT STUDENT PROFILE
|--------------------------------------------------------------------------
|
| PUT /api/students/me
|
*/

export async function updateMyProfile(
  profileData
) {
  try {
    const payload = {};

    /*
     * Only include fields that are
     * actually supplied.
     */

    if (
      profileData.full_name !==
      undefined
    ) {
      payload.full_name =
        profileData.full_name?.trim();
    }

    if (
      profileData.college_name !==
      undefined
    ) {
      payload.college_name =
        profileData.college_name?.trim();
    }

    if (
      profileData.degree !==
      undefined
    ) {
      payload.degree =
        profileData.degree?.trim();
    }

    if (
      profileData.branch !==
      undefined
    ) {
      payload.branch =
        profileData.branch?.trim();
    }

    if (
      profileData.phone !==
      undefined
    ) {
      payload.phone =
        profileData.phone?.trim();
    }

    if (
      profileData.tenth_cgpa !==
      undefined
    ) {
      payload.tenth_cgpa =
        profileData.tenth_cgpa === ""
          ? null
          : Number(
              profileData.tenth_cgpa
            );
    }

    if (
      profileData.twelfth_cgpa !==
      undefined
    ) {
      payload.twelfth_cgpa =
        profileData.twelfth_cgpa === ""
          ? null
          : Number(
              profileData.twelfth_cgpa
            );
    }

    if (
      profileData.be_cgpa !==
      undefined
    ) {
      payload.be_cgpa =
        profileData.be_cgpa === ""
          ? null
          : Number(
              profileData.be_cgpa
            );
    }

    const response = await api.put(
      "/students/me",
      payload
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GET STUDENT BY ID
|--------------------------------------------------------------------------
|
| GET /api/students/{student_id}
|
| This endpoint depends on your backend
| students router exposing this route.
|
*/

export async function getStudentById(
  studentId
) {
  try {
    if (!studentId) {
      throw new Error(
        "Student ID is required."
      );
    }

    const response = await api.get(
      `/students/${studentId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GET STUDENT DASHBOARD DATA
|--------------------------------------------------------------------------
|
| Currently the profile itself contains
| the verification/approval state.
|
*/

export async function getStudentDashboard() {
  try {
    const response = await api.get(
      "/students/me"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE STUDENT PROFILE
|--------------------------------------------------------------------------
|
| Alias used by profile components.
|
*/

export async function updateStudentProfile(
  profileData
) {
  return updateMyProfile(
    profileData
  );
}

/*
|--------------------------------------------------------------------------
| GET VERIFICATION STATUS
|--------------------------------------------------------------------------
|
| Returns:
|
| email_verified
| phone_verified
| approval_status
|
*/

export async function getVerificationStatus() {
  try {
    const student =
      await getMyProfile();

    return {
      email_verified:
        Boolean(
          student?.email_verified
        ),

      phone_verified:
        Boolean(
          student?.phone_verified
        ),

      approval_status:
        student?.approval_status ||
        "PENDING",

      fully_verified:
        Boolean(
          student?.email_verified &&
          student?.phone_verified
        ),
    };
  } catch (error) {
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| STUDENT API ERROR MESSAGE
|--------------------------------------------------------------------------
|
| Converts FastAPI errors into
| a readable UI message.
|
*/

export function getStudentErrorMessage(
  error
) {
  if (!error) {
    return "Something went wrong.";
  }

  /*
   * FastAPI validation error.
   */

  if (
    Array.isArray(
      error.response?.data?.detail
    )
  ) {
    return error.response.data.detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return (
          item?.msg ||
          "Invalid request."
        );
      })
      .join(" ");
  }

  /*
   * FastAPI HTTPException.
   */

  if (
    typeof error.response?.data?.detail ===
    "string"
  ) {
    return error.response.data.detail;
  }

  /*
   * Backend message.
   */

  if (
    typeof error.response?.data?.message ===
    "string"
  ) {
    return error.response.data.message;
  }

  /*
   * Axios/network error.
   */

  if (error.message) {
    return error.message;
  }

  return "Unable to process student request.";
}
