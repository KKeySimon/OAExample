import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem } from "@mui/material";

/**
 * You will find globals from this file useful!
 */
import { GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID } from "./globals";
import { ICalculateGrades, IUniversityClass } from "./types/api_types";
import { calcAllFinalGrade } from "./utils/calculate_grade";
import { GradeTable } from "./components/GradeTable"

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [finalGradeList, setFinalGradeList] = useState<ICalculateGrades[]>([]);

  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */

  //source: https://react.dev/reference/react/useEffect
  //Whenever user clicks new class from dropdown, the code below is run
  useEffect(() => {
    calcAllFinalGrade(currClassId).then(finalGrade => {
      setFinalGradeList(finalGrade)
    }).catch(error => {
      setFinalGradeList([])
    });
  }, [currClassId]);

  //source: https://stackoverflow.com/questions/45089866/specifying-onclick-event-type-with-typescript-and-react-konva
  /**
   * simple helper function for when user clicks on a menuitem in the dropdown
   */
  const chooseClass = (e: React.MouseEvent<HTMLElement>, classItem: string) => {
    //prevents useEffect from being triggered if someone presses the same class in the dropdown
    if (currClassId !== classItem) {
      setCurrClassId(classItem);
    }
  }

  //source: https://stackoverflow.com/questions/53819864/how-to-async-await-in-react-render-function
 /**
  * Returns a Select component with dropdown values for every class in fall 2022 given an API call /class/listBySemester/fall2022.
  * 
  * @remarks
  * fall2022 is hardcoded in the function but can easily be replaced with any other semester
  * 
  * @returns Select component with dropdown values for every class in fall 2022
  */
  const DropDownMenu = () => {
    const getFall2022Classes = async () => {
      const res = await fetch(`${BASE_API_URL}/class/listBySemester/fall2022?buid=${MY_BU_ID}`, {
        method: "GET",
        headers: GET_DEFAULT_HEADERS(),
      });
      const json = await res.json();
      setClassList(json);
    }
    getFall2022Classes()
    return (
      <Select fullWidth={true} defaultValue="" label="Class">
        {classList && classList.map((classItem: IUniversityClass) => (
          <MenuItem key={classItem.classId} value={classItem.title} onClick={(e) => chooseClass(e, classItem.classId)}>
            {classItem.title}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            {DropDownMenu()}
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          {/* Generates table from GradeTable component */}
          <GradeTable data={finalGradeList} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
