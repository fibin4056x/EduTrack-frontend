
import {
  useEffect,
  useState,
} from "react";

import {
  createStudentApi,
  updateStudentApi,
  getClassesApi,
  getDivisionsApi,
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

  /* =========================================
     STATE
  ========================================= */

  const [formData, setFormData] =
    useState(initialState);

  const [classes, setClasses] =
    useState([]);

  const [divisions, setDivisions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);






/* =========================================
   FILTER DIVISIONS BY SELECTED CLASS
========================================= */

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





  /* =========================================
     FETCH CLASSES
  ========================================= */

  const fetchClasses =
    async () => {

      try {

        const response =
          await getClassesApi();

        setClasses(
          response.data || []
        );

      } catch (error) {

        console.error(
          "Fetch classes error:",
          error
        );
      }
    };



  /* =========================================
     FETCH DIVISIONS
  ========================================= */

  const fetchDivisions =
    async () => {

      try {

        const response =
          await getDivisionsApi();

        setDivisions(
          response.data || []
        );

      } catch (error) {

        console.error(
          "Fetch divisions error:",
          error
        );
      }
    };



  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {

    fetchClasses();

    fetchDivisions();

  }, []);



  /* =========================================
     EDIT MODE
  ========================================= */

  useEffect(() => {

    if (editingStudent) {

      setFormData({
        classId:
          editingStudent.classId?._id || "",

        divisionId:
          editingStudent.divisionId?._id || "",

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

        aadhaarNumber:
          editingStudent.aadhaarNumber || "",

        examRegisterNumber:
          editingStudent.examRegisterNumber || "",
      });

    } else {

      setFormData(initialState);
    }

  }, [editingStudent]);



  /* =========================================
     RESET INVALID DIVISION
  ========================================= */

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

      setFormData((prev) => ({
        ...prev,
        divisionId: "",
      }));
    }

  }, [
    formData.classId,
    formData.divisionId,
    filteredDivisions,
  ]);



  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (editingStudent) {

          await updateStudentApi(
            editingStudent._id,
            formData
          );

        } else {

          await createStudentApi(
            formData
          );
        }

        setFormData(initialState);

        fetchStudents();

        if (onClose) {
          onClose();
        } else {
          clearEdit();
        }

      } catch (error) {

        console.error(
          "Student save error:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };



  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* =====================================
         ACADEMIC INFO
      ===================================== */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Academic Information
        </h2>

        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          className="w-full rounded border p-3"
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



        <select
          name="divisionId"
          value={formData.divisionId}
          onChange={handleChange}
          className="w-full rounded border p-3"
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



        <input
          type="date"
          name="admissionDate"
          value={
            formData.admissionDate
          }
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

      </div>



      {/* =====================================
         STUDENT INFO
      ===================================== */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Student Information
        </h2>

        <input
          type="text"
          name="nameEnglish"
          placeholder="Student Name (English)"
          value={
            formData.nameEnglish
          }
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />



        <input
          type="text"
          name="nameArabic"
          placeholder="Student Name (Arabic)"
          value={
            formData.nameArabic
          }
          onChange={handleChange}
          className="w-full rounded border p-3"
        />



        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full rounded border p-3"
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



        <input
          type="date"
          name="dateOfBirth"
          value={
            formData.dateOfBirth
          }
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

      </div>



      {/* =====================================
         IDENTITY INFO
      ===================================== */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Identity Information
        </h2>

        <input
          type="text"
          name="aadhaarNumber"
          placeholder="Aadhaar Number"
          value={
            formData.aadhaarNumber
          }
          onChange={handleChange}
          className="w-full rounded border p-3"
        />



        <input
          type="text"
          name="examRegisterNumber"
          placeholder="Exam Register Number"
          value={
            formData.examRegisterNumber
          }
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

      </div>



      {/* =====================================
         BUTTONS
      ===================================== */}

      <div className="flex gap-3">

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white"
        >

          {loading
            ? "Saving..."
            : editingStudent
            ? "Update"
            : "Create"}

        </button>



        {editingStudent && (

          <button
            type="button"
            onClick={
              onClose || clearEdit
            }
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  );
};



export default StudentForm;
