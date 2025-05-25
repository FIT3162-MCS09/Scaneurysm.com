// authServices.ts – consolidated with full profile helpers

import API from "./apiClient";

/* -----------------------------------------------------------
 * Patient registration / login types
 * --------------------------------------------------------- */
interface UserData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  medical_record_number: string;
  birth_date: string;
  sex: string;
  primary_doctor: string;
}
interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  access: string;
  refresh: string;
  [key: string]: any;
}
interface UserInfo {
  id: string;      // UUID
  username: string;
  email: string;
  role: string;
  gen_ai_whitelist ?: boolean; // optional, for future use
}

/* -----------------------------------------------------------
 * Doctor registration types
 * --------------------------------------------------------- */
interface DoctorSignupData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialty: string;
}
interface DoctorSignupResponse {
  id: string;
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialty: string;
  access: string;
  refresh: string;
}

/* -----------------------------------------------------------
 * PATIENT SERVICE
 * --------------------------------------------------------- */
const patientService = {
  async register(userData: UserData): Promise<RegisterResponse> {
    const form = new URLSearchParams();
    Object.entries(userData).forEach(([k, v]) => form.append(k, v));

    const res = await API.post<RegisterResponse>(
      "/auth/signup/patient/",
      form,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    // await authService.fetchUserProfile();
    return res.data;
  },

  async login(username: string, password: string) {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    const res = await API.post("/auth/signin/", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    await authService.fetchUserProfile();
    return res.data;
  },
};

/* -----------------------------------------------------------
 * DOCTOR SERVICE
 * --------------------------------------------------------- */
const doctorService = {
  async signup(doctorData: DoctorSignupData): Promise<DoctorSignupResponse> {
    const form = new URLSearchParams();
    Object.entries(doctorData).forEach(([k, v]) => form.append(k, v));

    const res = await API.post<DoctorSignupResponse>(
      "/auth/signup/doctor/",
      form,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    // this requires a valid access token, which is set after login and not signup
    // await authService.fetchUserProfile();
    return res.data;
  },

  async getProfile(doctorId: string) {
    const res = await API.get(`/doctors/${doctorId}/`);
    return res.data;
  },

  async updateProfile(doctorId: string, data: Partial<DoctorSignupData>) {
    const res = await API.patch(`/doctors/${doctorId}/`, data);
    return res.data;
  },
};

/* -----------------------------------------------------------
 * AUTH SERVICE – shared helpers for any logged‑in user
 * --------------------------------------------------------- */
const authService = {
  /* cache basic info for client-side role checks */
  async fetchUserProfile(): Promise<UserInfo> {
    const res = await API.get("/auth/profile/");

    const userInfo: UserInfo = {
      id: res.data.id,
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
      gen_ai_whitelist: res.data.gen_ai_whitelist
    };

    localStorage.setItem("user_info", JSON.stringify(userInfo));
    return userInfo;
  },

  /* -------- full profile CRUD used by ProfilePopup -------- */

  async getProfile(): Promise<any> {
    try {
      const res = await API.get("/auth/profile/");
      return res.data;
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      throw err.response?.data || { message: "Failed to fetch profile" };
    }
  },

  async updateProfile(data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }): Promise<any> {
    try {
      const res = await API.patch("/auth/profile/", data);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { message: "Failed to update profile" };
    }
  },

  async changePassword(data: { old_password: string; new_password: string }): Promise<void> {
    try {
      await API.post("/auth/change-password/", data);
    } catch (err: any) {
      throw err.response?.data || { message: "Failed to change password" };
    }
  },
};

export { patientService, doctorService, authService };
