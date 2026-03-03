import { addAIAlert } from "./aiAlerts";

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

function createAIAlertFromAuditEntry(entry) {
  const eventType = String(entry?.eventType || "").toUpperCase();

  if (eventType === "DRUG_SAFETY_CHECK") {
    const findings = entry?.details?.findings || [];
    const hasUnsafe = findings.some((item) => item?.isSafe === false);
    const unsafeDescriptions = findings
      .flatMap((item) => item?.analysis || [])
      .filter((item) => item?.severity && ["HIGH", "CRITICAL"].includes(String(item.severity).toUpperCase()))
      .map((item) => item?.description)
      .filter(Boolean);

    addAIAlert({
      patientId: entry.patientId,
      patientName: entry.patientName,
      type: "Drug Safety",
      message: hasUnsafe
        ? unsafeDescriptions[0] || "Potential drug interaction detected. Review recommended."
        : "Drug safety check completed with no critical interactions.",
      severity: hasUnsafe ? entry.severity || "HIGH" : "LOW",
      confidence: entry.confidence,
      sourceEventId: entry.id,
      sourceEventType: eventType,
      metadata: {
        checkedDrugs: entry?.details?.checkedDrugs || [],
      },
    });
    return;
  }

  if (eventType === "FILE_UPLOAD") {
    addAIAlert({
      patientId: entry.patientId,
      patientName: entry.patientName,
      type: "New Medical Record",
      message: `${entry?.details?.fileType || "File"} uploaded: ${entry?.details?.fileName || "Unnamed file"}`,
      severity: "LOW",
      sourceEventId: entry.id,
      sourceEventType: eventType,
      metadata: {
        consultationId: entry?.details?.consultationId,
      },
    });
    return;
  }

  if (eventType === "CONSULTATION_UPDATED") {
    addAIAlert({
      patientId: entry.patientId,
      patientName: entry.patientName,
      type: "Consultation Updated",
      message: `Consultation risk set to ${entry?.details?.riskLevel || entry?.severity || "--"}.`,
      severity: entry?.details?.riskLevel || entry.severity || "MEDIUM",
      sourceEventId: entry.id,
      sourceEventType: eventType,
      metadata: {
        consultationId: entry?.details?.consultationId,
        newDrugCount: entry?.details?.newDrugCount,
      },
    });
    return;
  }

  if (eventType === "APPOINTMENT_CANCELLED") {
    addAIAlert({
      patientId: entry.patientId,
      patientName: entry.patientName,
      type: "Appointment Workflow",
      message: "Scheduled appointment was cancelled. Follow-up may be required.",
      severity: "MEDIUM",
      sourceEventId: entry.id,
      sourceEventType: eventType,
    });
    return;
  }

  if (eventType === "APPOINTMENT_ACCEPTED") {
    addAIAlert({
      patientId: entry.patientId,
      patientName: entry.patientName,
      type: "Appointment Workflow",
      message: "Appointment accepted and moved to active consultation pipeline.",
      severity: "LOW",
      sourceEventId: entry.id,
      sourceEventType: eventType,
    });
  }
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
  createAIAlertFromAuditEntry(nextEntry);
  return nextEntry;
}

export function clearAuditLogs() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUDIT_LOGS_KEY);
}
