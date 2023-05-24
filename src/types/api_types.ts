/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This is a class as returned by the /class/listBySemester/{semester} API call
 */
export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: string;
  semester: string;
}

/**
 * This is a class as returned by the /class/listAssignments/{classId} API call
 */
export interface IClassAssignments {
  assignmentId: string;
  classId: string;
  date: string;
  weight: number;
}

/**
 * This is a class as returned by the /student/GetById/{studentId} API call
 */
export interface IUniversityStudent {
  dateEnrolled: string;
  name: string;
  status: string;
  universityId: number;
}

/**
 * This is a class as returned by the /student/listGrades/{studentId}/{classId} API call
 */
export interface IStudentGrades {
  classId: string;
  studentId: string;
  name: string;
  grades:  {
    [assignment: string]: string;
  }[];
}

/**
 * This is a class as formatted for the GradeTable component
 */
export interface ICalculateGrades {
  studentId: string;
  name: string;
  classId: string;
  title: string;
  semester: string;
  finalGrade: number;
}