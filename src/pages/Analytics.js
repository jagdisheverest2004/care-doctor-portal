import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const analyticsData = {
  chronicDiseases: [
    { name: "Hypertension", value: 45 },
    { name: "Diabetes", value: 38 },
    { name: "Cardiac Disease", value: 22 },
    { name: "Asthma", value: 18 },
    { name: "Kidney Disease", value: 12 },
  ],
  alertTrends: [
    { month: "Jan", High: 12, Medium: 18, Low: 25 },
    { month: "Feb", High: 15, Medium: 20, Low: 28 },
    { month: "Mar", High: 8, Medium: 16, Low: 22 },
    { month: "Apr", High: 20, Medium: 22, Low: 30 },
    { month: "May", High: 14, Medium: 18, Low: 26 },
  ],
  riskDistribution: [
    { name: "Very Low", value: 35 },
    { name: "Low", value: 28 },
    { name: "Medium", value: 20 },
    { name: "High", value: 12 },
    { name: "Critical", value: 5 },
  ],
};

function AnalyticsPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Analytics Dashboard</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Clinical insights and AI performance metrics
        </p>
      </motion.div>

      {/* STATS */}
      <div className="stats-grid">
        {[
          { label: "Total Patients Analyzed", value: "152", change: "+8%", color: "info" },
          { label: "Drug Interactions Detected", value: "23", change: "+12%", color: "warning" },
          { label: "Alert Accuracy Rate", value: "94.2%", change: "+2.1%", color: "success" },
          { label: "Prescription Errors Prevented", value: "47", change: "+15%", color: "danger" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className={`stat-card ${stat.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-change positive">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid-2">
        {/* CHRONIC DISEASES */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="card-title">Chronic Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.chronicDiseases}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" style={{ fontSize: "12px" }} />
              <YAxis style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* RISK DISTRIBUTION */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="card-title">Patient Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#16a34a" />
                <Cell fill="#0ea5e9" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
                <Cell fill="#991b1b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ALERT TRENDS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="card-title">AI Alert Trends (Last 5 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.alertTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" style={{ fontSize: "12px" }} />
            <YAxis style={{ fontSize: "12px" }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="High"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Medium"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Low"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ fill: "#16a34a", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* INSIGHTS */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="card-title">Key Insights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
          <div className="alert alert-success">
            <strong>✓ Alert Accuracy</strong>
            <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
              AI predictions are 94.2% accurate with minimal false positives
            </p>
          </div>
          <div className="alert alert-warning">
            <strong>⚠ Top Interaction</strong>
            <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
              Aspirin + Warfarin is the most common drug interaction detected
            </p>
          </div>
          <div className="alert alert-info">
            <strong>ℹ Common Disease</strong>
            <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
              Hypertension affects 45% of patients in the system
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default AnalyticsPage;
