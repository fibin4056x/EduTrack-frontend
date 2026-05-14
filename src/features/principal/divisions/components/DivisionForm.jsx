import {
  useEffect,
  useState,
} from "react";

import {
  createDivisionApi,
  updateDivisionApi,
  getClassesApi,
  getTeachersApi,
} from "../api/division.api.js";



const initialState = {
  name: "",

  classId: "",

  assignedTeacher: "",

  capacity: 40,
};



const DivisionForm = ({
  editingDivision,
  fetchDivisions,
  clearEdit,
  onClose,
}) => {

  const [formData, setFormData] =
    useState(initialState);

  const [classes, setClasses] =
    useState([]);

  const [teachers, setTeachers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);




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

        console.error(error);
      }
    };




  /* =========================================
     FETCH TEACHERS
  ========================================= */

  const fetchTeachers =
    async () => {

      try {

        const response =
          await getTeachersApi();

        setTeachers(
          response.data || []
        );

      } catch (error) {

        console.error(error);
      }
    };




  useEffect(() => {

    fetchClasses();

    fetchTeachers();

  }, []);




  /* =========================================
     EDIT MODE
  ========================================= */

  useEffect(() => {

    if (editingDivision) {

      setFormData({
        name:
          editingDivision.name || "",

        classId:
          editingDivision.classId?._id || "",

        assignedTeacher:
          editingDivision
            .assignedTeacher?._id || "",

        capacity:
          editingDivision.capacity || 40,
      });

    } else {

      setFormData(initialState);
    }

  }, [editingDivision]);




  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
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

        if (editingDivision) {

          await updateDivisionApi(
            editingDivision._id,
            formData
          );

        } else {

          await createDivisionApi(
            formData
          );
        }

        setFormData(initialState);

        fetchDivisions();

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




  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* DIVISION NAME */}

      <input
        type="text"
        name="name"
        placeholder="Division Name (A/B/C)"
        value={formData.name}
        onChange={handleChange}
        className="w-full rounded border p-3"
        required
      />



      {/* CLASS */}

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



      {/* ASSIGNED TEACHER */}

      <select
        name="assignedTeacher"
        value={
          formData.assignedTeacher
        }
        onChange={handleChange}
        className="w-full rounded border p-3"
      >

        <option value="">
          Select Teacher
        </option>

        {teachers.map((teacher) => (

          <option
            key={teacher._id}
            value={teacher._id}
          >

            {teacher.name}

          </option>
        ))}
      </select>



      {/* CAPACITY */}

      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />



      {/* BUTTONS */}

      <div className="flex gap-3">

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white"
        >

          {loading
            ? "Saving..."
            : editingDivision
            ? "Update"
            : "Create"}

        </button>



        {editingDivision && (

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



export default DivisionForm;