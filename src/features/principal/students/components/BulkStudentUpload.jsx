import {
  useRef,
  useState,
} from "react";

import { bulkUploadStudentsApi } from "../api/student.api.js";

const BulkStudentUpload = ({
  classes,
  divisions,
  fetchStudents,
}) => {
  const [classId, setClassId] =
    useState("");

  const [divisionId, setDivisionId] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fileInputRef =
    useRef(null);

  // =========================================
  // FILTER DIVISIONS
  // =========================================
  const filteredDivisions =
    divisions.filter((division) => {
      const divisionClassId =
        division.classId?._id ||
        division.classId;

      return (
        String(divisionClassId) ===
        String(classId)
      );
    });

  // =========================================
  // HANDLE CLASS CHANGE
  // =========================================
  const handleClassChange = (
    event
  ) => {
    setClassId(event.target.value);

    // reset division
    setDivisionId("");
  };

  // =========================================
  // HANDLE FILE CHANGE
  // =========================================
  const handleFileChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      setError(
        "Only Excel files are allowed."
      );

      event.target.value = "";

      return;
    }

    setFile(selectedFile);
  };

  // =========================================
  // HANDLE UPLOAD
  // =========================================
  const handleUpload = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !classId ||
      !divisionId ||
      !file
    ) {
      setError(
        "Please fill all fields."
      );

      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "classId",
        classId
      );

      formData.append(
        "divisionId",
        divisionId
      );

      formData.append(
        "file",
        file
      );

      const response =
        await bulkUploadStudentsApi(
          formData
        );

      setMessage(
        response?.data?.insertedCount
          ? `${response.data.insertedCount} students uploaded successfully`
          : "Students uploaded successfully"
      );

      await fetchStudents();

      // reset form
      setClassId("");
      setDivisionId("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    } catch (error) {
      console.log(
        error?.response?.data
      );

      setError(
        error?.response?.data
          ?.message ||
          "Upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="school-card space-y-6 p-6 sm:p-7"
    >
      {/* =====================================
          HEADER
      ===================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="school-pill">
            Bulk Import
          </span>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            Upload student records
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Select the class and
            division before uploading
            the Excel spreadsheet.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Accepted File
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            .xlsx or .xls
          </p>
        </div>
      </div>

      {/* =====================================
          FORM GRID
      ===================================== */}
      <div className="grid gap-5 lg:grid-cols-[1fr,1fr,1.2fr]">
        {/* CLASS */}
        <div>
          <label
            htmlFor="bulk-class"
            className="school-label"
          >
            Class
          </label>

          <select
            id="bulk-class"
            value={classId}
            onChange={
              handleClassChange
            }
            className="school-select"
            disabled={loading}
          >
            <option value="">
              Select Class
            </option>

            {classes.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* DIVISION */}
        <div>
          <label
            htmlFor="bulk-division"
            className="school-label"
          >
            Division
          </label>

          <select
            id="bulk-division"
            value={divisionId}
            onChange={(event) =>
              setDivisionId(
                event.target.value
              )
            }
            className="school-select"
            disabled={
              !classId || loading
            }
          >
            <option value="">
              Select Division
            </option>

            {filteredDivisions.map(
              (division) => (
                <option
                  key={division._id}
                  value={division._id}
                >
                  {division.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* FILE */}
        <div>
          <label
            htmlFor="bulk-file"
            className="school-label"
          >
            Spreadsheet File
          </label>

          <input
            id="bulk-file"
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={
              handleFileChange
            }
            className="school-file-input"
            disabled={loading}
          />
        </div>
      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}
      {message && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* =====================================
          ERROR MESSAGE
      ===================================== */}
      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* =====================================
          ACTIONS
      ===================================== */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading}
          className="school-button-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Uploading..."
            : "Upload Students"}
        </button>

        <p className="text-sm text-slate-500">
          Imported students will
          appear in the register
          after upload completes.
        </p>
      </div>
    </form>
  );
};

export default BulkStudentUpload;