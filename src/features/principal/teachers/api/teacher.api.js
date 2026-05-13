import  api from '../../../../lib/api';

export const getTeachers = async () => {
    const response = await api.get("/teachers");
    return response.data;

}


export const createTeacher = async (teacher) => {
    const response = await api.post("/teachers",teacherdata);
    return response.data;
}

export const updateTeacherstatus = async (teacherId, teacherData) => {
    const response = await api.patch(`/teachers/${teacherId}/status`, teacherData);
    return response.data;
}