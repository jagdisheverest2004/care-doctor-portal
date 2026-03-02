function Sidebar({ setPage }) {
    return (
        <div className="sidebar">
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={() => setPage("patients")}>Patients</button>
            <button onClick={() => setPage("appointments")}>Appointments</button>
            <button onClick={() => setPage("reports")}>Reports</button>
            <button onClick={() => setPage("ai")}>AI Insights</button>
        </div>
    );
}
export default Sidebar;
