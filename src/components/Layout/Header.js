function Header({ setPage }) {
    return (
        <div className="header">
            <div><strong>Care++ Hospital System</strong></div>
            <div className="navbar">
                <button onClick={() => setPage("dashboard")}>Dashboard</button>
                <button onClick={() => setPage("patients")}>Patients</button>
                <button onClick={() => setPage("appointments")}>Appointments</button>
                <button onClick={() => setPage("reports")}>Reports</button>
                <button onClick={() => setPage("ai")}>AI Insights</button>
            </div>
        </div>
    );
}

export default Header;