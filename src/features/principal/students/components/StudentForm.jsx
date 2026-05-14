import {
  useEffect,
  useState,
} from "react";

import {
  createStudentApi,
  updateStudentApi,
  getClassesApi,
} from "../api/student.api";

const initialState = {
  classId: "",
  divisionId: "",
  admissionDate: "",
  nameEnglish: "",
  nameArabic: "",
  gender: "",
  dateOfBirth: "",
  examRegisterNumber: "",
  aadhaarNumber: "",
  economicCategory: "",
  photo: "",
};

const getInitials = (name) => {
  if (!name) {
    return "ST";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part[0].toUpperCase()
    )
    .join("");
};

const StudentForm = ({
  editingStudent,
  fetchStudents,
  clearEdit,
  onClose,
}) => {
  const [formData, setFormData] =
    useState(initialState);

  const [classes, setClasses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const fetchClasses = async () => {
    try {
      const response =
        await getClassesApi();

      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        classId:
          editingStudent.classId?._id ||
          "",
        divisionId:
          editingStudent.divisionId?._id ||
          editingStudent.divisionId ||
          "",
        admissionDate:
          editingStudent.admissionDate
            ?.split("T")[0] || "",
        nameEnglish:
          editingStudent.nameEnglish || "",
        nameArabic:
          editingStudent.nameArabic || "",
        gender:
          editingStudent.gender || "",
        dateOfBirth:
          editingStudent.dateOfBirth
            ?.split("T")[0] || "",
        examRegisterNumber:
          editingStudent
            .examRegisterNumber || "",
        aadhaarNumber:
          editingStudent.aadhaarNumber ||
          "",
        economicCategory:
          editingStudent
            .economicCategory || "",
        photo: editingStudent.photo || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingStudent]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (editingStudent) {
        await updateStudentApi(
          editingStudent._id,
          formData
        );
      } else {
        await createStudentApi(formData);
      }

      setFormData(initialState);
      fetchStudents();

      if (onClose) {
        onClose();
      } else {
        clearEdit();
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = classes.find(
    (item) => item._id === formData.classId
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 sm:p-8"
    >
      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.9fr]">
        <section className="school-card p-6 sm:p-7">
          <span className="school-pill">
            Academic Placement
          </span>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            {editingStudent
              ? "Update the student profile"
              : "Set the classroom and admission details"}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Build a clean record for daily teaching, class tracking, and school administration while keeping your current save behavior unchanged.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="classId"
                className="school-label"
              >
                Class Name
              </label>

              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="school-input"
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
                    {item.name} /{" "}
                    {item.academicYear}
                  </option>
                ))}
              </select>

              <p className="school-helper">
                {selectedClass
                  ? `Selected class: ${selectedClass.name}, academic year ${selectedClass.academicYear}.`
                  : "Choose the classroom this student belongs to."}
              </p>
            </div>

            <div>
              <label
                htmlFor="divisionId"
                className="school-label"
              >
                Division Record Id
              </label>

              <input
                id="divisionId"
                type="text"
                name="divisionId"
                placeholder="Paste division id"
                value={formData.divisionId}
                onChange={handleChange}
                className="school-input"
                required
              />

              <p className="school-helper">
                Keep this linked to the correct division record used by the school office.
              </p>
            </div>

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
                value={formData.admissionDate}
                onChange={handleChange}
                className="school-input"
                required
              />

              <p className="school-helper">
                Use the official date from the student admission register.
              </p>
            </div>
          </div>
        </section>

        <aside className="overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#0f172a_0%,#172554_100%)] p-6 text-white shadow-2xl sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-100">
            Profile Preview
          </p>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-white/10 text-xl font-bold text-white">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={
                    formData.nameEnglish ||
                    "Student"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(
                  formData.nameEnglish
                )
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                {formData.nameEnglish ||
                  "Student Name"}
              </h3>

              <p className="mt-1 text-sm text-slate-300">
                {formData.nameArabic ||
                  "Secondary name can be added here"}
              </p>

              <span className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                {formData.gender ||
                  "Gender pending"}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm text-slate-200">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                Class Placement
              </p>

              <p className="mt-2 font-semibold text-white">
                {selectedClass
                  ? `${selectedClass.name} / ${selectedClass.academicYear}`
                  : "Class not selected"}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                Unique Record Reminder
              </p>

              <p className="mt-2 leading-6 text-slate-200">
                Use one clean exam register number and one Aadhaar number per student record when those details are available.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                Admission Snapshot
              </p>

              <p className="mt-2 leading-6 text-slate-200">
                Admission date:{" "}
                <span className="font-semibold text-white">
                  {formData.admissionDate ||
                    "Pending"}
                </span>
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="school-card p-6 sm:p-7">
          <span className="school-pill">
            Student Identity
          </span>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="nameEnglish"
                className="school-label"
              >
                Student Name
              </label>

              <input
                id="nameEnglish"
                type="text"
                name="nameEnglish"
                placeholder="Enter full student name"
                value={formData.nameEnglish}
                onChange={handleChange}
                className="school-input"
                required
              />

              <p className="school-helper">
                Keep the main name exactly as it should appear in attendance, report cards, and teacher-facing lists.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="nameArabic"
                className="school-label"
              >
                Secondary Name
              </label>

              <input
                id="nameArabic"
                type="text"
                name="nameArabic"
                placeholder="Optional secondary or Arabic name"
                value={formData.nameArabic}
                onChange={handleChange}
                className="school-input"
              />
            </div>

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
                className="school-input"
                required
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

            <div>
              <label
                htmlFor="dateOfBirth"
                className="school-label"
              >
                Date Of Birth
              </label>

              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="school-input"
                required
              />
            </div>
          </div>
        </section>

        <section className="school-card p-6 sm:p-7">
          <span className="school-pill">
            Identity And Support
          </span>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                placeholder="Enter unique exam number"
                value={
                  formData.examRegisterNumber
                }
                onChange={handleChange}
                className="school-input"
              />

              <p className="school-helper">
                Keep this unique to the student whenever the official number is available.
              </p>
            </div>

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
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="school-input"
              />
            </div>

            <div>
              <label
                htmlFor="economicCategory"
                className="school-label"
              >
                Economic Category
              </label>

              <select
                id="economicCategory"
                name="economicCategory"
                value={
                  formData.economicCategory
                }
                onChange={handleChange}
                className="school-input"
              >
                <option value="">
                  Select Category
                </option>

                <option value="BPL">
                  BPL
                </option>

                <option value="APL">
                  APL
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="photo"
                className="school-label"
              >
                Photo Url
              </label>

              <input
                id="photo"
                type="url"
                name="photo"
                placeholder="https://example.com/photo.jpg"
                value={formData.photo}
                onChange={handleChange}
                className="school-input"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          The form styling is updated for a more premium LP School feel, while the create and update logic underneath stays exactly in the same flow.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {editingStudent && (
            <button
              type="button"
              onClick={
                onClose || clearEdit
              }
              className="school-button-soft"
            >
              Cancel
            </button>
          )}

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
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
