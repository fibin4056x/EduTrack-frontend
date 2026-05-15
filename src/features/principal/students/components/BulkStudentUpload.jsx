
import {
  useRef,
  useState,
} from "react";

import {
  bulkUploadStudentsApi,
} from "../api/student.api.js";



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

  const fileInputRef =
    useRef(null);

  const [loading, setLoading] =
    useState(false);



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



  const handleUpload =
    async (e) => {

      e.preventDefault();

      if (
        !classId ||
        !divisionId ||
        !file
      ) {

        alert(
          "Please fill all fields"
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



        alert(
          response?.data?.insertedCount
            ? `${response.data.insertedCount} students uploaded successfully`
            : "Students uploaded successfully"
        );

        await fetchStudents();

        setClassId("");
        setDivisionId("");
        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

      } catch (error) {

  console.log(error.response?.data);

  alert(
    error.response?.data?.message ||
    "Upload failed"
  );


      } finally {

        setLoading(false);
      }
    };



  return (
    <form
      onSubmit={handleUpload}
      className="space-y-4 rounded border p-4"
    >

      <h2 className="text-lg font-semibold">
        Bulk Student Upload
      </h2>



      <select
        value={classId}
        onChange={(e) =>
          setClassId(e.target.value)
        }
        className="w-full rounded border p-3"
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
        value={divisionId}
        onChange={(e) =>
          setDivisionId(e.target.value)
        }
        className="w-full rounded border p-3"
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
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) =>
          setFile(
            e.target.files[0] ||
              null
          )
        }
        className="w-full"
      />



      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white"
      >

        {loading
          ? "Uploading..."
          : "Upload Students"}

      </button>

    </form>
  );
};



export default BulkStudentUpload;

