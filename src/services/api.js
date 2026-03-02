import axios from "axios";
import {
  clearAuthStorage,
  getAuthToken,
  getAuthUser,
  setAuthToken,
  setAuthUser,
} from "./auth";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function normalizeApiError(error, fallbackMessage = "Request failed") {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return { message: responseData, status: error?.response?.status };
  }

  if (responseData?.message || responseData?.error) {
    return {
      message: responseData.message || responseData.error,
      status: error?.response?.status,
      details: responseData,
    };
  }

  return {
    message: error?.message || fallbackMessage,
    status: error?.response?.status,
    details: responseData,
  };
}

async function request(promise, fallbackMessage) {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    throw normalizeApiError(error, fallbackMessage);
  }
}

function parseTokenFromResponse(data) {
  return data?.token || data?.jwt || data?.accessToken || null;
}

export const api = {
  auth: {
    async login(payload) {
      const data = await request(
        apiClient.post("/api/auth/login", payload),
        "Unable to login"
      );

      const token = parseTokenFromResponse(data);
      if (token) {
        setAuthToken(token);
      }

      setAuthUser({
        username: data?.username || payload?.username,
        role: data?.role || "DOCTOR",
      });

      return data;
    },

    async logout() {
      const data = await request(apiClient.post("/api/auth/logout"), "Unable to logout");
      clearAuthStorage();
      return data;
    },

    async registerDoctor(payload) {
      return request(apiClient.post("/api/auth/register", { ...payload, role: "DOCTOR" }), "Unable to register doctor");
    },

    async registerPatient(payload) {
      return request(apiClient.post("/api/auth/register", payload), "Unable to register patient");
    },
  },

  doctor: {
    async getProfile() {
      return request(apiClient.get("/api/doctor/get-profile"), "Unable to fetch doctor profile");
    },

    async updateProfile(payload) {
      return request(apiClient.patch("/api/doctor/update-profile", payload), "Unable to update profile");
    },

    async getAppointments(status = "SCHEDULED") {
      return request(
        apiClient.get("/api/doctor/patients/appointments", {
          params: status ? { status } : undefined,
        }),
        "Unable to fetch appointments"
      );
    },

    async updateAppointmentStatus(appointmentId, status) {
      return request(
        apiClient.patch(`/api/doctor/patients/appointments/${appointmentId}/scheduled`, null, {
          params: { status },
        }),
        "Unable to update appointment status"
      );
    },

    async getPatients(params) {
      return request(apiClient.get("/api/doctor/patients", { params }), "Unable to fetch patients");
    },

    async getPatientById(patientId) {
      return request(apiClient.get(`/api/doctor/patients/${patientId}`), "Unable to fetch patient details");
    },

    async checkDrugSafety(patientId, newDrugs) {
      return request(
        apiClient.post(`/api/doctor/patients/${patientId}/check-safety`, { newDrugs }),
        "Unable to check drug safety"
      );
    },

    async uploadReport(consultationId, file) {
      const formData = new FormData();
      formData.append("file", file);
      return request(
        apiClient.post(`/api/doctor/patients/consultations/${consultationId}/records/report`, formData),
        "Unable to upload report"
      );
    },

    async uploadXray(consultationId, file) {
      const formData = new FormData();
      formData.append("file", file);
      return request(
        apiClient.post(`/api/doctor/patients/consultations/${consultationId}/records/xray`, formData),
        "Unable to upload x-ray"
      );
    },

    async updateConsultation(consultationId, payload) {
      return request(
        apiClient.patch(`/api/doctor/patients/consultation/${consultationId}/update`, payload),
        "Unable to finalize consultation"
      );
    },

    async scheduleAppointment(patientId, payload) {
      return request(
        apiClient.post(`/api/doctor/patients/${patientId}/appointments`, payload),
        "Unable to schedule appointment"
      );
    },
  },

  patient: {
    async updateProfile(payload) {
      return request(apiClient.patch("/api/patients/update-profile", payload), "Unable to update patient profile");
    },

    async downloadMedicalRecord(patientId, recordId) {
      try {
        const response = await apiClient.get(`/api/patients/${patientId}/records/${recordId}/file`, {
          responseType: "blob",
        });
        return response.data;
      } catch (error) {
        throw normalizeApiError(error, "Unable to download file");
      }
    },
  },

  drugs: {
    async getAll() {
      return request(apiClient.get("/api/drugs/get-drugs"), "Unable to fetch drugs");
    },

    async add(payload) {
      return request(apiClient.post("/api/drugs/add-drug", payload), "Unable to add drug");
    },
  },

  authState: {
    getUser() {
      return getAuthUser();
    },
    setUser(user) {
      setAuthUser(user);
    },
    clear() {
      clearAuthStorage();
    },
    setToken(token) {
      setAuthToken(token);
    },
    getToken() {
      return getAuthToken();
    },
  },
};
