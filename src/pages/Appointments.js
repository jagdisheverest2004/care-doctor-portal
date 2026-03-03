import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { api } from "../services/api";

const APPOINTMENT_STATUSES = ["ALL","SCHEDULED", "ACCEPTED", "COMPLETED", "CANCELLED"];

function normalizeAppointmentsPayload(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.appointments)) return data.appointments;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
}

function getStatusBadge(status) {
    if (status === "COMPLETED") return "success";
    if (status === "ACCEPTED") return "info";
    if (status === "CANCELLED") return "danger";
    return "warning";
}

function Appointments() {
    const [status, setStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadAppointments = async (selectedStatus) => {
        setLoading(true);
        setError("");

        try {
            if (selectedStatus === "ALL") {
                const data = await api.doctor.getAppointments();
                const normalized = normalizeAppointmentsPayload(data).sort(
                    (first, second) => new Date(second.appointmentDateTime).getTime() - new Date(first.appointmentDateTime).getTime()
                );
                setAppointments(normalized);
            } else {
                const data = await api.doctor.getAppointments(selectedStatus);
                const normalized = normalizeAppointmentsPayload(data).sort(
                    (first, second) => new Date(second.appointmentDateTime).getTime() - new Date(first.appointmentDateTime).getTime()
                );
                setAppointments(normalized);
            }
        } catch (apiError) {
            setError(apiError?.message || "Failed to load appointments.");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments(status);
    }, [status]);

    const filteredAppointments = useMemo(() => {
        if (!search.trim()) return appointments;

        const value = search.toLowerCase();
        return appointments.filter((item) => {
            return (
                item?.patientName?.toLowerCase().includes(value) ||
                String(item?.patientId || "").toLowerCase().includes(value) ||
                String(item?.appointmentId || "").toLowerCase().includes(value)
            );
        });
    }, [appointments, search]);

    const handleStatusUpdate = async (appointmentId, nextStatus) => {
        setUpdatingId(appointmentId);
        setError("");

        try {
            await api.doctor.updateAppointmentStatus(appointmentId, nextStatus);
            await loadAppointments(status);
        } catch (apiError) {
            setError(apiError?.message || "Unable to update appointment status.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: "20px" }}>
                    <h1>Appointments</h1>
                    <p style={{ color: "#6b7280", marginTop: "8px" }}>
                        Manage scheduled requests and consultation flow
                    </p>
                </div>
            </motion.div>

            <motion.div
                className="card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1fr",
                        gap: "14px",
                    }}
                >
                    <div style={{ position: "relative" }}>
                        <FiSearch
                            style={{
                                position: "absolute",
                                left: "12px",
                                top: "12px",
                                color: "#9ca3af",
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search by patient name, patient ID, appointment ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "40px" }}
                        />
                    </div>

                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        {APPOINTMENT_STATUSES.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ marginTop: "14px" }}>
                        {error}
                    </div>
                )}
            </motion.div>

            <motion.div
                className="card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="card-header">
                    <h3 className="card-title">Appointment Requests ({filteredAppointments.length})</h3>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Patient</th>
                                <th>Date & Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                                        Loading appointments...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                                        No appointments found for this filter.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filteredAppointments.map((appointment) => {
                                    const isScheduled = appointment.appointmentStatus === "SCHEDULED";
                                    const isUpdating = updatingId === appointment.appointmentId;

                                    return (
                                        <tr key={appointment.appointmentId}>
                                            <td>#{appointment.appointmentId}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{appointment.patientName}</div>
                                                <div style={{ color: "#6b7280", fontSize: "12px" }}>ID: {appointment.patientId}</div>
                                            </td>
                                            <td>{new Date(appointment.appointmentDateTime).toLocaleString()}</td>
                                            <td>{appointment.reasonForAppointment}</td>
                                            <td>
                                                <span className={`badge badge-${getStatusBadge(appointment.appointmentStatus)}`}>
                                                    {appointment.appointmentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {isScheduled ? (
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            disabled={isUpdating}
                                                            onClick={() => handleStatusUpdate(appointment.appointmentId, "ACCEPTED")}
                                                        >
                                                            {isUpdating ? "Updating..." : "Accept"}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            disabled={isUpdating}
                                                            onClick={() => handleStatusUpdate(appointment.appointmentId, "CANCELLED")}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#6b7280", fontSize: "12px" }}>No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}

export default Appointments;
