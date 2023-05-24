/**
 * You might find it useful to have some dummy data for your own testing.
 * Feel free to write this function if you find that feature desirable.
 * 
 * When you come to office hours for help, we will ask you if you have written
 * this function and tested your project using it.
 */
import { ICalculateGrades } from "../types/api_types";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

//source: https://codesandbox.io/s/2djn8c?file=/demo.tsx
/**
  * Returns a DataGrid component given a list of calculateGrades objects.
  *
  * @param data - Data parsed from calculate_grade.ts
  * @returns DataGrid component visualizing the data
  */
export const GradeTable = ({data}: {data : ICalculateGrades[]}) => {
  const rows = data;
  const rowsWithId = rows.map((row, index) => ({...row, id: index}));
  const columns : GridColDef[] = [
    { field: 'studentId', headerName: 'Student ID', width: 100 },
    { field: 'name', headerName: 'Student Name', width: 150 },
    { field: 'classId', headerName: 'Class ID', width: 100 },
    { field: 'title', headerName: 'Class Name', width: 100 },
    { field: 'semester', headerName: 'Semester', width: 100 },
    { field: 'finalGrade', headerName: 'Final Grade', width: 100 },
  ];
  return <Box sx={{ height: 600, width: "100%" }}>
    <DataGrid rows={rowsWithId} columns={columns}/>;
  </Box>
};
