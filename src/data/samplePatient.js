const patients = [
    {
        id: "P1001",
        name: "John Doe",
        age: 65,
        bloodGroup: "O+",
        allergies: ["Penicillin"],
        chronicDiseases: ["Hypertension"],
        currentMedicines: ["Warfarin"],
        timeline: [
            { date: "01-01-2025 10:00", event: "Diagnosed with Hypertension" },
            { date: "10-01-2025 11:30", event: "Prescribed Warfarin" }
        ],
        vitals: [
            { date: "01-01-2025", bp: "140/90", sugar: "180 mg/dL" },
            { date: "10-01-2025", bp: "130/85", sugar: "150 mg/dL" }
        ],
        prescriptions: [
            { medicine: "Warfarin", dose: "5mg", duration: "30 days" }
        ],
        reports: [
            { name: "Blood_Test.pdf", type: "Lab Report" },
            { name: "Chest_XRay.pdf", type: "Radiology" }
        ]
    }
];

export default patients;