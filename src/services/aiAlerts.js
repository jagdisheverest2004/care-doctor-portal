const AI_ALERTS_KEY = "care_doctor_portal_ai_alerts";
const MAX_AI_ALERTS = 1000;

function safeParse(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readAlerts() {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(AI_ALERTS_KEY));
}

function writeAlerts(alerts) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AI_ALERTS_KEY, JSON.stringify(alerts));
}

function severityRank(severity) {
  const value = String(severity || "LOW").toUpperCase();
  if (value === "CRITICAL") return 4;
  if (value === "HIGH") return 3;
  if (value === "MEDIUM") return 2;
  return 1;
}

function normalizeSeverity(value) {
  const next = String(value || "LOW").toUpperCase();
  if (["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(next)) return next;
  return "LOW";
}

function normalizeConfidence(value) {
  if (value === "--" || value == null || value === "") return null;

  const asString = String(value).trim();
  if (asString.endsWith("%")) {
    const parsed = Number(asString.replace("%", ""));
    if (!Number.isNaN(parsed)) return Math.max(0, Math.min(100, parsed));
  }

  const parsed = Number(asString);
  if (Number.isNaN(parsed)) return null;

  if (parsed > 1) return Math.max(0, Math.min(100, parsed));
  return Math.max(0, Math.min(100, parsed * 100));
}

function formatConfidence(confidence) {
  if (confidence == null) return "--";
  return `${confidence.toFixed(1)}%`;
}

function calculatePriorityScore(severity, confidence) {
  const base = severityRank(severity) * 25;
  const confidenceBoost = confidence == null ? 0 : Math.min(25, confidence / 4);
  return Math.round(Math.min(100, base + confidenceBoost));
}

export function getAIAlerts() {
  return readAlerts().sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}

export function addAIAlert(payload) {
  const severity = normalizeSeverity(payload?.severity);
  const confidence = normalizeConfidence(payload?.confidence);

  const nextAlert = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    patientId: String(payload?.patientId || "--"),
    patientName: String(payload?.patientName || "--"),
    type: String(payload?.type || "Operational Alert"),
    message: String(payload?.message || "AI alert generated"),
    severity,
    confidence,
    confidenceLabel: formatConfidence(confidence),
    priorityScore: calculatePriorityScore(severity, confidence),
    status: String(payload?.status || "OPEN"),
    sourceEventId: payload?.sourceEventId || null,
    sourceEventType: payload?.sourceEventType || null,
    metadata: payload?.metadata || {},
  };

  const current = readAlerts();
  const next = [nextAlert, ...current].slice(0, MAX_AI_ALERTS);
  writeAlerts(next);
  return nextAlert;
}

export function acknowledgeAIAlert(alertId) {
  const next = readAlerts().map((alert) => {
    if (String(alert.id) !== String(alertId)) return alert;
    return { ...alert, status: "ACKNOWLEDGED" };
  });
  writeAlerts(next);
}

export function clearAIAlerts() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AI_ALERTS_KEY);
}
