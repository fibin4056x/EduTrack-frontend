import {
  useEffect,
  useState,
} from "react";

import {
  createStudentApi,
  getClassesApi,
  getDivisionsApi,
  updateStudentApi,
} from "../api/student.api.js";

const initialState = {
  classId: "",
  divisionId: "",
  admissionDate: "",
  nameEnglish: "",
  nameArabic: "",
  gender: "",
  dateOfBirth: "",
  aadhaarNumber: "",
  examRegisterNumber: "",
};

const StudentForm = ({
  editingStudent,
  fetchStudents,
  clearEdit,
  onClose,
}) => {
  // =========================================
  // STATES
  // =========================================
  const [formData, setFormData] =
    useState(initialState);

  const [classes, setClasses] =
    useState([]);

  const [divisions, setDivisions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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
        String(formData.classId)
      );
    });

  // =========================================
  // FETCH DATA
  // =========================================
  const fetchInitialData =
    async () => {
      try {
        const [
          classesResponse,
          divisionsResponse,
        ] = await Promise.all([
          getClassesApi(),
          getDivisionsApi(),
        ]);

        setClasses(
          classesResponse.data || []
        );

        setDivisions(
          divisionsResponse.data || []
        );
      } catch (error) {
        console.error(
          "Initial fetch error:",
          error
        );

        setError(
          "Failed to load form data."
        );
      }
    };

  // =========================================
  // INITIAL FETCH
  // =========================================
  useEffect(() => {
    fetchInitialData();
  }, []);

  // =========================================
  // EDIT MODE
  // =========================================
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        classId:
          editingStudent.classId?._id ||
          "",

        divisionId:
          editingStudent.divisionId
            ?._id || "",

        admissionDate:
          editingStudent.admissionDate?.split(
            "T"
          )[0] || "",

        nameEnglish:
          editingStudent.nameEnglish ||
          "",

        nameArabic:
          editingStudent.nameArabic ||
          "",

        gender:
          editingStudent.gender || "",

        dateOfBirth:
          editingStudent.dateOfBirth?.split(
            "T"
          )[0] || "",

        aadhaarNumber:
          editingStudent.aadhaarNumber ||
          "",

        examRegisterNumber:
          editingStudent.examRegisterNumber ||
          "",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingStudent]);

  // =========================================
  // RESET INVALID DIVISION
  // =========================================
  useEffect(() => {
    if (
      formData.classId &&
      formData.divisionId &&
      !filteredDivisions.find(
        (division) =>
          division._id ===
          formData.divisionId
      )
    ) {
      setFormData((previous) => ({
        ...previous,
        divisionId: "",
      }));
    }
  }, [
    formData.classId,
    formData.divisionId,
    filteredDivisions,
  ]);

  // =========================================
  // HANDLE CHANGE
  // =========================================
  const handleChange = (event) => {
    const { name, value } =
      event.target;

    // Aadhaar sanitization
    if (name === "aadhaarNumber") {
      const numericValue =
        value.replace(/\D/g, "");

      setFormData((previous) => ({
        ...previous,
        [name]: numericValue,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE SUBMIT
  // =========================================
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const payload = {
        ...formData,

        nameEnglish:
          formData.nameEnglish.trim(),

        nameArabic:
          formData.nameArabic.trim(),

        examRegisterNumber:
          formData.examRegisterNumber.trim(),
      };

      if (editingStudent) {
        await updateStudentApi(
          editingStudent._id,
          payload
        );

        setSuccess(
          "Student updated successfully."
        );
      } else {
        await createStudentApi(
          payload
        );

        setSuccess(
          "Student created successfully."
        );
      }

      await fetchStudents();

      setFormData(initialState);

      // close modal after short delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          clearEdit();
        }
      }, 700);
    } catch (error) {
      console.error(
        "Student save error:",
        error
      );

      setError(
        error?.response?.data
          ?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 sm:p-8"
    >
      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}
      {success && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
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

      <div className="grid gap-5 xl:grid-cols-3">
        {/* =====================================
            ACADEMIC SECTION
        ===================================== */}
        <section className="rounded-[28px] bg-slate-50/80 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Academic Information
          </p>

          <div className="mt-5 space-y-4">
            {/* CLASS */}
            <div>
              <label
                htmlFor="classId"
                className="school-label"
              >
                Class
              </label>

              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="school-select"
                disabled={loading}
                required
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
                htmlFor="divisionId"
                className="school-label"
              >
                Division
              </label>

              <select
                id="divisionId"
                name="divisionId"
                value={formData.divisionId}
                onChange={handleChange}
                className="school-select"
                disabled={
                  !formData.classId ||
                  loading
                }
                required
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

            {/* ADMISSION DATE */}
            <div>
              <label
                htmlFor="admissionDate"
                className="school-label"
              >
                Admission Date
              </label>

              <input
                id="admissionDate"
                type="date"
                name="admissionDate"
                value={
                  formData.admissionDate
                }
                onChange={handleChange}
                className="school-input"
                disabled={loading}
                required
              />
            </div>
          </div>
        </section>

        {/* =====================================
            STUDENT INFO
        ===================================== */}
        <section className="rounded-[28px] bg-slate-50/80 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Student Information
          </p>

          <div className="mt-5 space-y-4">
            {/* NAME ENGLISH */}
            <div>
              <label
                htmlFor="nameEnglish"
                className="school-label"
              >
                Student Name in English
              </label>

              <input
                id="nameEnglish"
                type="text"
                name="nameEnglish"
                placeholder="Enter student name"
                value={
                  formData.nameEnglish
                }
                onChange={handleChange}
                className="school-input"
                disabled={loading}
                required
              />
            </div>

            {/* NAME ARABIC */}
            <div>
              <label
                htmlFor="nameArabic"
                className="school-label"
              >
                Student Name in Arabic
              </label>

              <input
                id="nameArabic"
                type="text"
                name="nameArabic"
                placeholder="Optional"
                value={
                  formData.nameArabic
                }
                onChange={handleChange}
                className="school-input"
                disabled={loading}
              />
            </div>

            {/* GENDER */}
            <div>
              <label
                htmlFor="gender"
                className="school-label"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="school-select"
                disabled={loading}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="school-label"
              >
                Date of Birth
              </label>

              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={
                  formData.dateOfBirth
                }
                onChange={handleChange}
                className="school-input"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* =====================================
            IDENTITY SECTION
        ===================================== */}
        <section className="rounded-[28px] bg-slate-50/80 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Identity Information
          </p>

          <div className="mt-5 space-y-4">
            {/* AADHAAR */}
            <div>
              <label
                htmlFor="aadhaarNumber"
                className="school-label"
              >
                Aadhaar Number
              </label>

              <input
                id="aadhaarNumber"
                type="text"
                name="aadhaarNumber"
                placeholder="Enter Aadhaar number"
                value={
                  formData.aadhaarNumber
                }
                onChange={handleChange}
                className="school-input"
                maxLength={12}
                inputMode="numeric"
                disabled={loading}
              />
            </div>

            {/* EXAM NUMBER */}
            <div>
              <label
                htmlFor="examRegisterNumber"
                className="school-label"
              >
                Exam Register Number
              </label>

              <input
                id="examRegisterNumber"
                type="text"
                name="examRegisterNumber"
                placeholder="Enter exam register number"
                value={
                  formData.examRegisterNumber
                }
                onChange={handleChange}
                className="school-input"
                disabled={loading}
              />
            </div>
          </div>
        </section>
      </div>

      {/* =====================================
          ACTIONS
      ===================================== */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="school-button-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Saving..."
            : editingStudent
            ? "Update Student"
            : "Create Student"}
        </button>

        {editingStudent && (
          <button
            type="button"
            onClick={
              onClose || clearEdit
            }
            disabled={loading}
            className="school-button-soft"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;