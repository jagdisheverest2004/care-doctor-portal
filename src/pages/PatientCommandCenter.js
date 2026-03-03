import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PatientHeader from "../components/PatientHeader";
import TabsNav from "../components/TabsNav";
import { api } from "../services/api";
import { addAuditLog } from "../services/auditLog";

const DRUG_TIME_OPTIONS = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"];

function formatRiskLabel(level) {
  if (!level) return "Low";
  const value = String(level).toLowerCase();
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function formatApiDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function toApiDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function makeEmptyNewDrug() {
  return {
    drugId: "",
    dosage: "",
    instructions: "",
    startDate: "",
    endDate: "",
    drugTimes: [],
  };
}

function summarizeSafetyResult(data) {
  const results = data?.results || [];
  const allItems = results.flatMap((result) => result?.analysis_results || []);

  let highestSeverity = "LOW";
  let highestConfidence = null;

  const severityRank = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
  allItems.forEach((item) => {
    const severity = String(item?.result?.severity || "LOW").toUpperCase();
    if ((severityRank[severity] || 1) > (severityRank[highestSeverity] || 1)) {
      highestSeverity = severity;
    }

    const confidenceRaw = item?.result?.confidence ?? item?.result?.confidenceLevel;
    const confidence = Number(confidenceRaw);
    if (!Number.isNaN(confidence)) {
      highestConfidence = highestConfidence === null ? confidence : Math.max(highestConfidence, confidence);
    }
  });

  return {
    severity: highestSeverity,
    confidence: highestConfidence === null ? "--" : `${(highestConfidence * 100).toFixed(1)}%`,
  };
}

function matchesRecordSearch(record, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return true;

  const fileName = String(record?.fileName || "").toLowerCase();
  const fileType = String(record?.fileType || "").toLowerCase();
  return fileName.includes(normalizedQuery) || fileType.includes(normalizedQuery);
}

function formatRecordNameForDisplay(fileName, maxBaseLength = 10) {
  const normalizedFileName = String(fileName || "");
  if (!normalizedFileName) return "--";

  const lastDotIndex = normalizedFileName.lastIndexOf(".");
  if (lastDotIndex <= 0 || lastDotIndex === normalizedFileName.length - 1) {
    return normalizedFileName.length > maxBaseLength
      ? `${normalizedFileName.slice(0, maxBaseLength)}...`
      : normalizedFileName;
  }

  const fileBaseName = normalizedFileName.slice(0, lastDotIndex);
  const fileExtension = normalizedFileName.slice(lastDotIndex);

  if (fileBaseName.length <= maxBaseLength) {
    return normalizedFileName;
  }

  return `${fileBaseName.slice(0, maxBaseLength)}...${fileExtension}`;
}

function matchesConsultationSearch(consultation, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return true;

  const doctor = String(consultation?.prescribedDoctorName || "").toLowerCase();
  const purpose = String(consultation?.purpose || "").toLowerCase();
  const visitedAt = formatApiDateTime(consultation?.visitedAt).toLowerCase();
  return doctor.includes(normalizedQuery) || purpose.includes(normalizedQuery) || visitedAt.includes(normalizedQuery);
}

function getPrescriptionTimeCounts(drugs) {
  const counts = {
    MORNING: 0,
    AFTERNOON: 0,
    EVENING: 0,
    NIGHT: 0,
  };

  (drugs || []).forEach((drug) => {
    (drug?.drugTimes || []).forEach((timeValue) => {
      const normalized = String(timeValue || "").toUpperCase();
      if (counts[normalized] !== undefined) {
        counts[normalized] += 1;
      }
    });
  });

  return counts;
}

function ConsultationsTable({ consultations }) {
  const [searchValue, setSearchValue] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedConsultationId, setExpandedConsultationId] = useState("");

  const filteredConsultations = useMemo(() => {
    return (consultations || []).filter((consultation) => {
      const matchesSearch = matchesConsultationSearch(consultation, searchValue);
      const matchesRisk =
        riskFilter === "ALL" || String(consultation?.riskLevel || "LOW").toUpperCase() === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [consultations, searchValue, riskFilter]);

  const sortedConsultations = useMemo(() => {
    const nextValues = [...filteredConsultations];
    nextValues.sort((firstValue, secondValue) => {
      const firstTime = new Date(firstValue?.visitedAt || 0).getTime();
      const secondTime = new Date(secondValue?.visitedAt || 0).getTime();
      return sortOrder === "asc" ? firstTime - secondTime : secondTime - firstTime;
    });
    return nextValues;
  }, [filteredConsultations, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedConsultationId("");
  }, [searchValue, riskFilter, sortOrder, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedConsultations.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedConsultations.slice(startIndex, endIndex);
  }, [sortedConsultations, currentPage, pageSize]);

  const rangeStart = sortedConsultations.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(currentPage * pageSize, sortedConsultations.length);

  return (
    <div className="consultation-history-table-wrapper">
      <div className="medical-records-search-row">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search by doctor, purpose or visited time"
          aria-label="Search consultations"
        />
      </div>

      <div className="medical-records-controls-row">
        <div className="medical-records-control-group">
          <label htmlFor="consultations-risk-filter">Risk Filter</label>
          <select
            id="consultations-risk-filter"
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
          >
            <option value="ALL">All Risks</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <div className="medical-records-control-group">
          <label htmlFor="consultations-order">Order</label>
          <select
            id="consultations-order"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="desc">Latest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="medical-records-control-group">
          <label htmlFor="consultations-rows">Rows</label>
          <select
            id="consultations-rows"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value) || 10)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {sortedConsultations.length ? (
        <>
          <div className="table-container consultation-prescription-table consultation-history-table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Purpose</th>
                  <th>Visited At</th>
                  <th>Consultation</th>
                </tr>
              </thead>
              <tbody>
                {paginatedConsultations.map((consultation) => {
                  const consultationId = consultation?.id;
                  const isExpanded = String(expandedConsultationId) === String(consultationId);
                  const records = consultation?.medicalRecords || [];
                  const imageCount = records.filter((record) => String(record?.fileType || "").toUpperCase() === "IMAGE").length;
                  const reportCount = records.filter((record) => String(record?.fileType || "").toUpperCase() === "REPORT").length;
                  const prescriptions = consultation?.drugsPrescribed || [];
                  const timeCounts = getPrescriptionTimeCounts(prescriptions);

                  return [
                    <tr key={`consultation-${consultationId}`}>
                      <td>{consultation?.prescribedDoctorName || "--"}</td>
                      <td>{consultation?.purpose || "--"}</td>
                      <td>{formatApiDateTime(consultation?.visitedAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setExpandedConsultationId((previousValue) => (
                            String(previousValue) === String(consultationId) ? "" : consultationId
                          ))}
                        >
                          {isExpanded ? "Hide Consultation" : "View Consultation"}
                        </button>
                      </td>
                    </tr>,
                    <tr key={`consultation-detail-${consultationId}`} className="consultation-details-row">
                      <td colSpan={4}>
                        <div className={`consultation-details-collapsible ${isExpanded ? "open" : ""}`}>
                          <div className="consultation-details-body">
                            <p><strong>Notes:</strong> {consultation?.notes || "--"}</p>
                            <p><strong>Medical Records:</strong> Total {records.length} • Image {imageCount} • Report {reportCount}</p>
                            <p><strong>Prescriptions:</strong> {prescriptions.length}</p>
                            <p>
                              <strong>Prescription Times:</strong>{" "}
                              Morning {timeCounts.MORNING} • Afternoon {timeCounts.AFTERNOON} • Evening {timeCounts.EVENING} • Night {timeCounts.NIGHT}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>,
                  ];
                })}
              </tbody>
            </table>
          </div>

          <div className="medical-records-pagination-row">
            <small>
              Showing {rangeStart}-{rangeEnd} of {sortedConsultations.length} consultations
            </small>
            <div className="medical-records-pagination-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage((previousValue) => Math.max(1, previousValue - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} / {totalPages}</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage((previousValue) => Math.min(totalPages, previousValue + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          {(consultations || []).length ? "No consultations match your search/filter." : "No consultation history found."}
        </p>
      )}
    </div>
  );
}

function MedicalRecordsTable({
  records,
  searchValue,
  onSearchChange,
  expandedRecordId,
  onToggleSummary,
  onDownload,
}) {
  const [sortBy, setSortBy] = useState("uploadedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    return (records || []).filter((record) => matchesRecordSearch(record, searchValue));
  }, [records, searchValue]);

  const sortedRecords = useMemo(() => {
    const nextRecords = [...filteredRecords];
    nextRecords.sort((firstRecord, secondRecord) => {
      let firstValue = "";
      let secondValue = "";

      if (sortBy === "fileName") {
        firstValue = String(firstRecord?.fileName || "").toLowerCase();
        secondValue = String(secondRecord?.fileName || "").toLowerCase();
      } else if (sortBy === "fileType") {
        firstValue = String(firstRecord?.fileType || "").toLowerCase();
        secondValue = String(secondRecord?.fileType || "").toLowerCase();
      } else {
        firstValue = new Date(firstRecord?.uploadedAt || 0).getTime();
        secondValue = new Date(secondRecord?.uploadedAt || 0).getTime();
      }

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return sortOrder === "asc" ? firstValue - secondValue : secondValue - firstValue;
      }

      if (firstValue < secondValue) return sortOrder === "asc" ? -1 : 1;
      if (firstValue > secondValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return nextRecords;
  }, [filteredRecords, sortBy, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, sortBy, sortOrder, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRecords.slice(startIndex, endIndex);
  }, [sortedRecords, currentPage, pageSize]);

  const rangeStart = sortedRecords.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(currentPage * pageSize, sortedRecords.length);

  const totalColumns = onDownload ? 5 : 4;

  return (
    <div className="medical-records-table-wrapper">
      <div className="medical-records-search-row">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by record name or type"
          aria-label="Search medical records"
        />
      </div>

      <div className="medical-records-controls-row">
        <div className="medical-records-control-group">
          <label htmlFor="records-sort-by">Sort by</label>
          <select
            id="records-sort-by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="uploadedAt">Upload Date</option>
            <option value="fileType">Type</option>
            <option value="fileName">Name</option>
          </select>
        </div>

        <div className="medical-records-control-group">
          <label htmlFor="records-sort-order">Order</label>
          <select
            id="records-sort-order"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="medical-records-control-group">
          <label htmlFor="records-page-size">Rows</label>
          <select
            id="records-page-size"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value) || 10)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {sortedRecords.length ? (
        <>
          <div className="table-container consultation-prescription-table medical-records-table-container">
            <table>
              <thead>
                <tr>
                  <th>Record Name</th>
                  <th>Type</th>
                  <th>Uploaded At</th>
                  <th>Summary</th>
                  {onDownload ? <th>Download</th> : null}
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => {
                  const isExpanded = String(expandedRecordId) === String(record.recordId);
                  return [
                    <tr key={`record-${record.recordId}-${record.fileName}`}>
                      <td title={record.fileName || ""}>{formatRecordNameForDisplay(record.fileName)}</td>
                      <td>{record.fileType || "--"}</td>
                      <td>{formatApiDateTime(record.uploadedAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onToggleSummary(record.recordId)}
                        >
                          {isExpanded ? "Hide Summary" : "View Summary"}
                        </button>
                      </td>
                      {onDownload ? (
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => onDownload(record)}
                          >
                            Download
                          </button>
                        </td>
                      ) : null}
                    </tr>,
                    <tr key={`record-summary-${record.recordId}-${record.fileName}`} className="medical-record-summary-row">
                      <td colSpan={totalColumns}>
                        <div className={`record-summary-collapsible ${isExpanded ? "open" : ""}`}>
                          <div className="record-summary-body">
                            {record.fileSummary || "No summary available for this record."}
                          </div>
                        </div>
                      </td>
                    </tr>,
                  ];
                })}
              </tbody>
            </table>
          </div>

          <div className="medical-records-pagination-row">
            <small>
              Showing {rangeStart}-{rangeEnd} of {sortedRecords.length} records
            </small>
            <div className="medical-records-pagination-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage((previousValue) => Math.max(1, previousValue - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} / {totalPages}</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage((previousValue) => Math.min(totalPages, previousValue + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          {(records || []).length ? "No records match your search." : "No medical records."}
        </p>
      )}
    </div>
  );
}

function PatientCommandCenter({ patient: propPatient }) {
  const { id } = useParams();
  const [tab, setTab] = useState("overview");
  const [patient, setPatient] = useState(propPatient || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedConsultationId, setSelectedConsultationId] = useState("");
  const [drugsList, setDrugsList] = useState([]);

  const [reportFile, setReportFile] = useState(null);
  const [xrayFile, setXrayFile] = useState(null);
  const [uploadingType, setUploadingType] = useState("");

  const [selectedSafetyDrugs, setSelectedSafetyDrugs] = useState([]);
  const [safetyResult, setSafetyResult] = useState(null);
  const [safetyLoading, setSafetyLoading] = useState(false);

  const [consultationSaving, setConsultationSaving] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    chronicConditions: "",
    allergies: "",
    purpose: "",
    notes: "",
    riskLevel: "MEDIUM",
    newDrugs: [makeEmptyNewDrug()],
  });

  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    reasonForAppointment: "",
    appointmentDateTime: "",
  });
  const [reportsRecordSearch, setReportsRecordSearch] = useState("");
  const [reportsExpandedRecordId, setReportsExpandedRecordId] = useState("");

  const loadPatientDetails = useCallback(async (patientId) => {
    if (!patientId) return;
    setLoading(true);
    setError("");

    try {
      const data = await api.doctor.getPatientById(patientId);
      setPatient(data);
    } catch (apiError) {
      setError(apiError?.message || "Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (propPatient) {
      setPatient(propPatient);
      return;
    }
    if (id) {
      loadPatientDetails(id);
    }
  }, [id, propPatient, loadPatientDetails]);

  useEffect(() => {
    const loadDrugs = async () => {
      try {
        const data = await api.drugs.getAll();
        setDrugsList(data?.drugsList || []);
      } catch {
        setDrugsList([]);
      }
    };

    loadDrugs();
  }, []);

  const consultations = useMemo(() => patient?.doctorVisits || [], [patient]);

  useEffect(() => {
    if (!consultations.length) {
      setSelectedConsultationId("");
      return;
    }

    setSelectedConsultationId((currentValue) => {
      if (currentValue && consultations.some((visit) => String(visit.id) === String(currentValue))) {
        return currentValue;
      }
      return String(consultations[consultations.length - 1].id);
    });
  }, [consultations]);

  const selectedConsultation = useMemo(() => {
    return consultations.find((visit) => String(visit.id) === String(selectedConsultationId)) || null;
  }, [consultations, selectedConsultationId]);

  useEffect(() => {
    setReportsRecordSearch("");
    setReportsExpandedRecordId("");
  }, [selectedConsultationId]);

  useEffect(() => {
    if (!patient) return;

    setConsultationForm((prev) => ({
      ...prev,
      chronicConditions: patient.chronicConditions || "",
      allergies: patient.allergies || "",
      purpose: selectedConsultation?.purpose || "",
      notes: selectedConsultation?.notes || "",
      riskLevel: selectedConsultation?.riskLevel || "MEDIUM",
    }));
  }, [patient, selectedConsultation]);

  const headerPatient = useMemo(() => {
    const latest = consultations[consultations.length - 1];
    return {
      name: patient?.name,
      age: patient?.age,
      gender: patient?.gender,
      bloodGroup: patient?.bloodGroup,
      riskLevel: formatRiskLabel(latest?.riskLevel || "LOW"),
      lastVisit: latest?.visitedAt ? new Date(latest.visitedAt).toLocaleDateString() : "--",
      phone: patient?.contactNumber || "--",
    };
  }, [patient, consultations]);

  const handleDownloadRecord = async (record) => {
    if (!patient?.id || !record?.recordId) return;

    setError("");
    try {
      const blob = await api.patient.downloadMedicalRecord(patient.id, record.recordId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = record.fileName || `record-${record.recordId}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(apiError?.message || "Unable to download file.");
    }
  };

  const handleUpload = async (type) => {
    if (!selectedConsultationId) {
      setError("Please select a consultation first.");
      return;
    }

    const file = type === "report" ? reportFile : xrayFile;
    if (!file) {
      setError(`Please choose a ${type} file before upload.`);
      return;
    }

    setUploadingType(type);
    setError("");
    setMessage("");

    try {
      if (type === "report") {
        await api.doctor.uploadReport(selectedConsultationId, file);
        setReportFile(null);
      } else {
        await api.doctor.uploadXray(selectedConsultationId, file);
        setXrayFile(null);
      }

      const currentUser = api.authState.getUser();
      addAuditLog({
        doctor: currentUser?.name || currentUser?.username || "Doctor",
        patientId: patient?.id,
        patientName: patient?.name,
        eventType: "FILE_UPLOAD",
        action: "Uploaded Medical File",
        reason: `${type === "report" ? "Report" : "X-ray Image"} uploaded for consultation #${selectedConsultationId}`,
        details: {
          consultationId: selectedConsultationId,
          fileType: type === "report" ? "REPORT" : "IMAGE",
          fileName: file?.name || "--",
        },
      });

      setMessage(`${type === "report" ? "Report" : "X-ray"} uploaded successfully.`);
      await loadPatientDetails(patient?.id || id);
    } catch (apiError) {
      setError(apiError?.message || "Upload failed.");
    } finally {
      setUploadingType("");
    }
  };

  const handleSafetyCheck = async () => {
    if (!patient?.id) return;
    if (!selectedSafetyDrugs.length) {
      setError("Please select at least one drug for safety check.");
      return;
    }

    setSafetyLoading(true);
    setError("");
    setSafetyResult(null);

    try {
      const data = await api.doctor.checkDrugSafety(patient.id, selectedSafetyDrugs);
      setSafetyResult(data);

      const currentUser = api.authState.getUser();
      const summary = summarizeSafetyResult(data);
      addAuditLog({
        doctor: currentUser?.name || currentUser?.username || "Doctor",
        patientId: patient?.id,
        patientName: patient?.name,
        eventType: "DRUG_SAFETY_CHECK",
        action: "Ran Drug Safety Check",
        reason: `Checked ${selectedSafetyDrugs.length} drug(s): ${selectedSafetyDrugs.join(", ")}`,
        severity: summary.severity,
        confidence: summary.confidence,
        details: {
          checkedDrugs: selectedSafetyDrugs,
          overallSafe: data?.overall_safe,
          findings: (data?.results || []).map((result) => ({
            newDrug: result?.new_drug,
            isSafe: result?.is_safe,
            analysis: (result?.analysis_results || []).map((item) => ({
              currentMed: item?.current_med,
              description: item?.result?.description,
              severity: item?.result?.severity,
              confidence: item?.result?.confidence ?? item?.result?.confidenceLevel,
            })),
          })),
        },
      });
    } catch (apiError) {
      setError(apiError?.message || "Safety check failed.");
    } finally {
      setSafetyLoading(false);
    }
  };

  const updateNewDrugRow = (index, key, value) => {
    setConsultationForm((prev) => {
      const nextRows = [...prev.newDrugs];
      nextRows[index] = { ...nextRows[index], [key]: value };
      return { ...prev, newDrugs: nextRows };
    });
  };

  const toggleDrugTime = (index, value) => {
    setConsultationForm((prev) => {
      const nextRows = [...prev.newDrugs];
      const currentTimes = nextRows[index].drugTimes || [];
      const exists = currentTimes.includes(value);
      nextRows[index] = {
        ...nextRows[index],
        drugTimes: exists
          ? currentTimes.filter((timeValue) => timeValue !== value)
          : [...currentTimes, value],
      };
      return { ...prev, newDrugs: nextRows };
    });
  };

  const handleFinalizeConsultation = async () => {
    if (!selectedConsultationId) {
      setError("Please choose a consultation to finalize.");
      return;
    }

    const newDrugs = consultationForm.newDrugs
      .filter((row) => row.drugId)
      .map((row) => ({
        drugId: Number(row.drugId),
        dosage: row.dosage,
        instructions: row.instructions,
        startDate: row.startDate,
        endDate: row.endDate,
        drugTimes: row.drugTimes,
      }));

    const payload = {
      chronicConditions: consultationForm.chronicConditions,
      allergies: consultationForm.allergies,
      doctorVisit: {
        purpose: consultationForm.purpose,
        notes: consultationForm.notes,
        riskLevel: consultationForm.riskLevel,
        newDrugs,
      },
    };

    setConsultationSaving(true);
    setError("");
    setMessage("");

    try {
      await api.doctor.updateConsultation(selectedConsultationId, payload);

      const currentUser = api.authState.getUser();
      addAuditLog({
        doctor: currentUser?.name || currentUser?.username || "Doctor",
        patientId: patient?.id,
        patientName: patient?.name,
        eventType: "CONSULTATION_UPDATED",
        action: "Updated Consultation",
        reason: `Consultation #${selectedConsultationId} updated with risk ${consultationForm.riskLevel}`,
        severity: consultationForm.riskLevel,
        details: {
          consultationId: selectedConsultationId,
          purpose: consultationForm.purpose,
          notes: consultationForm.notes,
          riskLevel: consultationForm.riskLevel,
          newDrugCount: newDrugs.length,
          newDrugs,
        },
      });

      setMessage("Consultation finalized successfully.");
      await loadPatientDetails(patient?.id || id);
    } catch (apiError) {
      setError(apiError?.message || "Failed to finalize consultation.");
    } finally {
      setConsultationSaving(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!patient?.id) return;
    if (!scheduleForm.reasonForAppointment || !scheduleForm.appointmentDateTime) {
      setError("Please provide reason and date/time for next appointment.");
      return;
    }

    setScheduleSaving(true);
    setError("");
    setMessage("");

    try {
      await api.doctor.scheduleAppointment(patient.id, {
        reasonForAppointment: scheduleForm.reasonForAppointment,
        appointmentDateTime: toApiDateTime(scheduleForm.appointmentDateTime),
      });

      const currentUser = api.authState.getUser();
      addAuditLog({
        doctor: currentUser?.name || currentUser?.username || "Doctor",
        patientId: patient?.id,
        patientName: patient?.name,
        eventType: "APPOINTMENT_SCHEDULED",
        action: "Scheduled Follow-up Appointment",
        reason: scheduleForm.reasonForAppointment,
        details: {
          appointmentDateTime: toApiDateTime(scheduleForm.appointmentDateTime),
        },
      });

      setScheduleForm({ reasonForAppointment: "", appointmentDateTime: "" });
      setMessage("Follow-up appointment scheduled successfully.");
    } catch (apiError) {
      setError(apiError?.message || "Failed to schedule appointment.");
    } finally {
      setScheduleSaving(false);
    }
  };

  if (loading && !patient) {
    return (
      <div className="command-container">
        <div className="section-card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>⏳ Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!loading && !patient) {
    return (
      <div className="command-container">
        <div className="section-card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: "1.1rem" }}>{error || "Patient data not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="command-container">
      <PatientHeader patient={headerPatient} />

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="command-grid">
        <div>
          <TabsNav tab={tab} setTab={setTab} />

          {tab === "overview" && (
            <div className="section-card consultation-overview-card">
              <h3>Patient Profile & Consultation History</h3>
              <div className="patient-meta-grid">
                <div className="patient-meta-column patient-meta-single">
                  <p><strong>Patient ID:</strong> {patient.id}</p>
                  <p><strong>Date of Birth:</strong> {patient.dateOfBirth || "--"}</p>
                  <p><strong>Address:</strong> {patient.address || "--"}</p>
                  <p><strong>Contact:</strong> {patient.contactNumber || "--"}</p>
                  <p><strong>Allergies:</strong> {patient.allergies || "--"}</p>
                  <p><strong>Chronic Conditions:</strong> {patient.chronicConditions || "--"}</p>
                </div>
              </div>

              <ConsultationsTable consultations={consultations} />
            </div>
          )}

          {tab === "reports" && (
            <div className="section-card">
              <h3>Medical Records</h3>

              <div className="form-group">
                <label>Consultation</label>
                <select
                  value={selectedConsultationId}
                  onChange={(event) => setSelectedConsultationId(event.target.value)}
                >
                  {consultations.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      Consultation #{visit.id} - {formatApiDateTime(visit.visitedAt)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ marginTop: "12px" }}>
                <div className="section-card" style={{ marginBottom: 0 }}>
                  <h4>Upload Report</h4>
                  <input type="file" onChange={(event) => setReportFile(event.target.files?.[0] || null)} />
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleUpload("report")}
                    disabled={uploadingType === "report"}
                  >
                    {uploadingType === "report" ? "Uploading..." : "Upload Report"}
                  </button>
                </div>

                <div className="section-card" style={{ marginBottom: 0 }}>
                  <h4>Upload X-Ray Image</h4>
                  <input type="file" onChange={(event) => setXrayFile(event.target.files?.[0] || null)} />
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleUpload("xray")}
                    disabled={uploadingType === "xray"}
                  >
                    {uploadingType === "xray" ? "Uploading..." : "Upload X-Ray"}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <h4>Available Records</h4>
                <MedicalRecordsTable
                  records={selectedConsultation?.medicalRecords || []}
                  searchValue={reportsRecordSearch}
                  onSearchChange={setReportsRecordSearch}
                  expandedRecordId={reportsExpandedRecordId}
                  onToggleSummary={(recordId) => {
                    setReportsExpandedRecordId((previousValue) => (
                      String(previousValue) === String(recordId) ? "" : recordId
                    ));
                  }}
                  onDownload={handleDownloadRecord}
                />
              </div>
            </div>
          )}

          {tab === "alerts" && (
            <div className="section-card">
              <h3>AI Drug Safety Check</h3>

              <div className="form-group">
                <label>Select New Drugs (Multi-select)</label>
                <select
                  multiple
                  value={selectedSafetyDrugs}
                  onChange={(event) => {
                    const values = Array.from(event.target.selectedOptions).map((option) => option.value);
                    setSelectedSafetyDrugs(values);
                  }}
                  style={{ minHeight: "140px" }}
                >
                  {drugsList.map((drug) => (
                    <option key={drug.id} value={drug.drugName}>{drug.drugName}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary" onClick={handleSafetyCheck} disabled={safetyLoading}>
                {safetyLoading ? "Checking..." : "Run Safety Check"}
              </button>

              {safetyResult && (
                <div style={{ marginTop: "16px" }}>
                  <div className={`alert ${safetyResult.overall_safe ? "alert-success" : "alert-danger"}`}>
                    <strong>Overall Safe:</strong> {String(safetyResult.overall_safe)}
                  </div>

                  {(safetyResult.results || []).map((result) => (
                    <div key={result.new_drug} className="section-card" style={{ marginBottom: "12px", padding: "14px" }}>
                      <h4 style={{ marginBottom: "8px" }}>{result.new_drug} ({result.is_safe ? "Safe" : "Warning"})</h4>
                      {(result.analysis_results || []).map((item, index) => (
                        <div key={`${result.new_drug}-${index}`} className={`alert ${item.result?.interaction_detected ? "alert-warning" : "alert-success"}`}>
                          <div>
                            <p style={{ margin: 0 }}><strong>{item.current_med}</strong> + <strong>{item.new_drug}</strong></p>
                            <p style={{ margin: "6px 0" }}>{item.result?.description}</p>
                            <small>Severity: {item.result?.severity} • Source: {item.result?.source}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "prescription" && (
            <div className="section-card">
              <h3>Finalize Consultation</h3>

              <div className="form-group">
                <label>Consultation</label>
                <select value={selectedConsultationId} onChange={(event) => setSelectedConsultationId(event.target.value)}>
                  {consultations.map((visit) => (
                    <option key={visit.id} value={visit.id}>Consultation #{visit.id}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Chronic Conditions</label>
                <input
                  value={consultationForm.chronicConditions}
                  onChange={(event) => setConsultationForm((prev) => ({ ...prev, chronicConditions: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Allergies</label>
                <input
                  value={consultationForm.allergies}
                  onChange={(event) => setConsultationForm((prev) => ({ ...prev, allergies: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Purpose</label>
                <input
                  value={consultationForm.purpose}
                  onChange={(event) => setConsultationForm((prev) => ({ ...prev, purpose: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  rows={4}
                  value={consultationForm.notes}
                  onChange={(event) => setConsultationForm((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Risk Level</label>
                <select
                  value={consultationForm.riskLevel}
                  onChange={(event) => setConsultationForm((prev) => ({ ...prev, riskLevel: event.target.value }))}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <h4>New Drugs</h4>
              {consultationForm.newDrugs.map((row, index) => (
                <div key={index} className="section-card" style={{ marginBottom: "10px", padding: "12px" }}>
                  <div className="form-group">
                    <label>Drug</label>
                    <select
                      value={row.drugId}
                      onChange={(event) => updateNewDrugRow(index, "drugId", event.target.value)}
                    >
                      <option value="">Select Drug</option>
                      {drugsList.map((drug) => (
                        <option key={drug.id} value={drug.id}>{drug.drugName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Dosage</label>
                      <input value={row.dosage} onChange={(event) => updateNewDrugRow(index, "dosage", event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Instructions</label>
                      <input value={row.instructions} onChange={(event) => updateNewDrugRow(index, "instructions", event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input type="date" value={row.startDate} onChange={(event) => updateNewDrugRow(index, "startDate", event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input type="date" value={row.endDate} onChange={(event) => updateNewDrugRow(index, "endDate", event.target.value)} />
                    </div>
                  </div>

                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Drug Times</label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {DRUG_TIME_OPTIONS.map((timeOption) => (
                      <label key={timeOption} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="checkbox"
                          checked={row.drugTimes.includes(timeOption)}
                          onChange={() => toggleDrugTime(index, timeOption)}
                        />
                        {timeOption}
                      </label>
                    ))}
                  </div>

                  {consultationForm.newDrugs.length > 1 && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ marginTop: "10px" }}
                      onClick={() => {
                        setConsultationForm((prev) => ({
                          ...prev,
                          newDrugs: prev.newDrugs.filter((_, rowIndex) => rowIndex !== index),
                        }));
                      }}
                    >
                      Remove Drug
                    </button>
                  )}
                </div>
              ))}

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setConsultationForm((prev) => ({ ...prev, newDrugs: [...prev.newDrugs, makeEmptyNewDrug()] }))}
              >
                Add Another Drug
              </button>

              <button
                className="btn btn-primary"
                style={{ marginTop: "12px" }}
                disabled={consultationSaving}
                onClick={handleFinalizeConsultation}
              >
                {consultationSaving ? "Saving..." : "Finalize Consultation"}
              </button>

              <hr />

              <h4>Schedule Follow-up Appointment</h4>
              <div className="form-group">
                <label>Reason For Appointment</label>
                <input
                  value={scheduleForm.reasonForAppointment}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, reasonForAppointment: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Appointment Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleForm.appointmentDateTime}
                  onChange={(event) => setScheduleForm((prev) => ({ ...prev, appointmentDateTime: event.target.value }))}
                />
              </div>

              <button className="btn btn-primary" disabled={scheduleSaving} onClick={handleScheduleAppointment}>
                {scheduleSaving ? "Scheduling..." : "Schedule Appointment"}
              </button>
            </div>
          )}

          {tab === "surgery" && (
            <div className="section-card">
              <h3>Surgery Data</h3>
              <p style={{ color: "#6b7280" }}>No surgery records are returned by the current backend patient endpoint.</p>
            </div>
          )}

          {tab === "medications" && (
            <div className="section-card">
              <h3>Medication History</h3>
              {selectedConsultation?.drugsPrescribed?.length ? (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Drug</th>
                        <th>Dosage</th>
                        <th>Instructions</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedConsultation.drugsPrescribed.map((drug) => (
                        <tr key={drug.id}>
                          <td>{drug.drugName}</td>
                          <td>{drug.dosage}</td>
                          <td>{drug.instructions}</td>
                          <td>{(drug.drugTimes || []).join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "#6b7280" }}>No medications found.</p>
              )}
            </div>
          )}

          {tab === "labs" && (
            <div className="section-card">
              <h3>Lab Trends</h3>
              <p style={{ color: "#6b7280" }}>
                Lab trend telemetry is not exposed from the current API response. Uploaded reports and summaries are available in the Reports tab.
              </p>
            </div>
          )}
        </div>

        <motion.div
          className="ai-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3>🤖 Clinical Snapshot</h3>
          <div className="insight-card blue">Patient ID: {patient.id}</div>
          <div className="insight-card yellow">Consultations: {consultations.length}</div>
          <div className="insight-card red">Allergies: {patient.allergies || "None"}</div>
          <div className="insight-card green">Last Visit: {formatApiDateTime(consultations[consultations.length - 1]?.visitedAt)}</div>
          <small>
            Current risk inferred from latest consultation.
          </small>
        </motion.div>
      </div>
    </div>
  );
}

export default PatientCommandCenter;
