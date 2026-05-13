import { use, useEffect,useState } from "react";
import { getTeachers } from "../api/teacher.api";

const useTeachers = () => {
    const [teacher,setTeacher] = useState([]);
    const [loading,setLoading] = useState(false);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await getTeachers();
            setTeacher(response.data)
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setLoading(false);      
        }
    };
    useEffect(() => {
        fetchTeachers();
    },[]);

    return {teacher,loading,fetchTeachers};
};

export default useTeachers;