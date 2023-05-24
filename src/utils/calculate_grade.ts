/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass, IClassAssignments, IUniversityStudent, IStudentGrades, ICalculateGrades } from "../types/api_types";
import { GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID } from "../globals";

/**
  * Returns all student's final grade given a studentGrades object and the weights for each classAssignments.
  *
  * @remarks
  * This function uses outputs from grabStudentsGrade() & grabAssignmentWeight()
  * 
  * @param student - Student object which contains a list of grades
  * @param classAssignments - Object that shows each assignment's weight
  * @returns A student's final grade
  */
export function calculateStudentFinalGrade(
  student: IStudentGrades,
  classAssignments: IClassAssignments[]
) : number {
  
  let weightDist = new Map();
  classAssignments.forEach(function (assignment) {
    weightDist.set(assignment.assignmentId, assignment.weight);
  });
  let finalGrade = 0
  Object.keys(student.grades[0]).forEach(function (assignment) {
    finalGrade += weightDist.get(assignment) / 100 * parseInt(student.grades[0][assignment])
  });
  return Math.round(finalGrade * 100) / 100
}

//source: All API calls used this as a template https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
/**
  * Returns all assignment details for a given classID.
  *
  * @param classID - classID
  * @returns Array of assignment objects for a given classID
  */
async function grabAssignmentWeight(classID: string): Promise<IClassAssignments[]> {
  const res = await fetch(`${BASE_API_URL}/class/listAssignments/${classID}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
}

/**
  * Returns all studentID's for a given classID.
  *
  * @param classID - classID
  * @returns Array of studentID's for a given classID
  */
async function grabStudentsID(classID: string): Promise<string[]> {
  const res = await fetch(`${BASE_API_URL}/class/listStudents/${classID}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
}

/**
  * Returns an array of student detail for each studentID given.
  *
  * @remarks
  * The input of this function is given by the grabStudentsID() function
  *
  * @param studentIDArr - Array with element containing a studentID
  * @returns Array of student information for each studentID given
  */
async function grabStudentsData(studentIDArr: string[]): Promise<IUniversityStudent[]> {
  const promises = studentIDArr.map(async function (sid) {
    const res = await fetch(`${BASE_API_URL}/student/GetById/${sid}?buid=${MY_BU_ID}`, {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    return json[0]
  })
  const arr = await Promise.all(promises)
  return arr;
}

/**
  * Returns an array of student's grades in classID for each studentID provided
  *
  * @remarks
  * studentIDArr is given by the grabStudentsID() function
  *
  * @param classID - classID
  * @param studentIDArr - Array with eacb element containing a studentID
  * @returns Array of student's grade information for each studentID given
  */
async function grabStudentsGrade(classID : string, studentIDArr: IUniversityStudent[]): Promise<IStudentGrades[]> {
  const promises = studentIDArr.map(async function (sid) {
    const res = await fetch(`${BASE_API_URL}/student/listGrades/${sid.universityId}/${classID}?buid=${MY_BU_ID}`, {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    return json
  })
  const arr = await Promise.all(promises)
  return arr;
}

/**
  * Returns class details for a given classID.
  *
  * @param classID - classID
  * @returns An object containing class details
  */
async function grabCourseInfo(classID : string): Promise<IUniversityClass> {
  const res = await fetch(`${BASE_API_URL}/class/GetById/${classID}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json
}

/**
  * Returns all student's final grade parsed for the GradeTable components columns
  * 
  * @remarks
  * This function relies on the output of grabAssignmentWeight, grabStudentsID,grabStudentsData, grabStudentsGrade, grabCourseInfo, calculateStudentFinalGrade
  * 
  * @param classID - classID
  * @returns A array of student's and their final grade for given classID
  */
export async function calcAllFinalGrade(classID: string): Promise<ICalculateGrades[]> {
  if (classID === "") {
    return []
  }
  let assignmentWeightArr = await grabAssignmentWeight(classID);
  let studentIDArr = await grabStudentsID(classID);
  let studentDataArr = await grabStudentsData(studentIDArr);
  let gradesPerStudentArr = await grabStudentsGrade(classID, studentDataArr);
  let courseInfo = await grabCourseInfo(classID)
  
  let finalGradesArr : ICalculateGrades[] = []
  gradesPerStudentArr.forEach(function (student) {
    finalGradesArr.push({
      studentId: student.studentId,
      name: student.name,
      classId: classID,
      title: courseInfo.title,
      semester: "fall2022",
      finalGrade: calculateStudentFinalGrade(student, assignmentWeightArr)
    })
  })
  
  return finalGradesArr;
}
