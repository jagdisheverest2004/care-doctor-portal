const AUDIT_LOGS_KEY = "care_doctor_portal_audit_logs";
const MAX_AUDIT_LOGS = 1000;

function safeParse(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readLogs() {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(AUDIT_LOGS_KEY));
}

function writeLogs(logs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
}

function normalizeText(value, fallback = "--") {
  const text = String(value || "").trim();
  return text || fallback;
}

export function getAuditLogs() {
  return readLogs().sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}

export function addAuditLog(entry) {
  const nextEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    doctor: normalizeText(entry?.doctor, "Unknown Doctor"),
    patientId: normalizeText(entry?.patientId, "--"),
    patientName: normalizeText(entry?.patientName, "--"),
    eventType: normalizeText(entry?.eventType, "GENERAL"),
    action: normalizeText(entry?.action, "System Action"),
    reason: normalizeText(entry?.reason, "No reason provided"),
    severity: normalizeText(entry?.severity, "--"),
    confidence: normalizeText(entry?.confidence, "--"),
    details: entry?.details || {},
  };

  const current = readLogs();
  const next = [nextEntry, ...current].slice(0, MAX_AUDIT_LOGS);
  writeLogs(next);
  return nextEntry;
}

export function clearAuditLogs() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUDIT_LOGS_KEY);
}
