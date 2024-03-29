import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TimetableCT } from "../mock/timetable";
import axios from "axios";
import { useEffect, useState } from "react";
import { configs } from "../config";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ScheduleTeacherStudent() {
  const [rows, setRows] = useState(TimetableCT[0].schedule);

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("user")).role === "Student" ||
      JSON.parse(localStorage.getItem("user")).role === "Parent"
    )
      axios({
        method: "get",
        url: `${configs.backendUrl}/api/student`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }).then((res) => {
        var _info = res.data.data.data.filter(
          (item) =>
            item.username === JSON.parse(localStorage.getItem("user")).username
        )[0];
        axios({
          method: "get",
          url: `${configs.backendUrl}/api/class/timetable/` + _info.classId,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }).then((response) => {
          // console.log(response.data.data);
          setRows(response.data.data);
        });
      });
    else {
      var _rows = [
        {
          lesson: 1,
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
        },
        {
          lesson: 2,
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
        },
        {
          lesson: 3,
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
        },
        {
          lesson: 4,
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
        },
        {
          lesson: 5,
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
        },
      ];

      axios({
        method: "get",
        url: `${configs.backendUrl}/api/teacher`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }).then((res) => {
        var _info = res.data.data.data.filter(
          (item) =>
            item.username === JSON.parse(localStorage.getItem("user")).username
        )[0];
        // console.log("Teacher Info: ", _info);

        axios({
          method: "get",
          url: `${configs.backendUrl}/api/class/listClassOfTeacher/` + _info.id,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }).then((listClassResponse) => {
          console.log("List class of teacher: ", listClassResponse.data.data);
          var _listClassOfTeacher = listClassResponse.data.data;

          for (let i = 0; i < _listClassOfTeacher.length; ++i) {
            // console.log("Class " + i + ": ", _listClassOfTeacher[i]);

            axios({
              method: "get",
              url:
                `${configs.backendUrl}/api/class/timetable/` +
                _listClassOfTeacher[i].id,
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }).then((classTable) => {
              // console.log("Class Table: ", classTable.data.data);
              var _classTable = classTable.data.data;
              _classTable = _classTable.sort((a, b) => a.lesson - b.lesson);
              for (var j = 0; j < _classTable.length; ++j) {
                // console.log(888, _classTable[j]);
                // console.log(999, _listClassOfTeacher[i]);
                if (_classTable[j].monday === _info.subject)
                  _rows[
                    j
                  ].monday = `${_listClassOfTeacher[i].name} - ${_listClassOfTeacher[i].location} - ${_info.subject}`;
                if (_classTable[j].tuesday === _info.subject)
                  _rows[
                    j
                  ].tuesday = `${_listClassOfTeacher[i].name} - ${_listClassOfTeacher[i].location} - ${_info.subject}`;
                if (_classTable[j].wednesday === _info.subject)
                  _rows[
                    j
                  ].wednesday = `${_listClassOfTeacher[i].name} - ${_listClassOfTeacher[i].location} - ${_info.subject}`;
                if (_classTable[j].thursday === _info.subject)
                  _rows[
                    j
                  ].thursday = `${_listClassOfTeacher[i].name} - ${_listClassOfTeacher[i].location} - ${_info.subject}`;
                if (_classTable[j].friday === _info.subject)
                  _rows[
                    j
                  ].friday = `${_listClassOfTeacher[i].name} - ${_listClassOfTeacher[i].location} - ${_info.subject}`;
                if (_classTable[j].saturday === _info.subject)
                  _rows[
                    j
                  ].saturday = `${_listClassOfTeacher[i].name} - ${_listClassOfTeacher[i].location} - ${_info.subject}`;
              }
              // _rows.sort((a, b) => a.lesson - b.lesson);
              console.log("Teacher time table: ", _rows);
              setRows(_rows);
              console.log(99999, _rows);

              console.log(8888);
              // setRows((_rows) => ({ _rows, ..._rows }));
            });
          }
          // setRows(_rows);
        });
      });
    }
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tiết</StyledTableCell>
            <StyledTableCell align="center">Thứ hai</StyledTableCell>
            <StyledTableCell align="center">Thứ ba</StyledTableCell>
            <StyledTableCell align="center">Thứ tư</StyledTableCell>
            <StyledTableCell align="center">Thứ năm</StyledTableCell>
            <StyledTableCell align="center">Thứ sáu</StyledTableCell>
            <StyledTableCell align="center">Thứ bảy</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .sort((a, b) => a.lesson - b.lesson)
            .map((row) => (
              <StyledTableRow key={row.lesson}>
                <StyledTableCell component="th" scope="row">
                  {row.lesson}
                </StyledTableCell>
                <StyledTableCell align="center">{row.monday}</StyledTableCell>
                <StyledTableCell align="center">{row.tuesday}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.wednesday}
                </StyledTableCell>
                <StyledTableCell align="center">{row.thursday}</StyledTableCell>
                <StyledTableCell align="center">{row.friday}</StyledTableCell>
                <StyledTableCell align="center">{row.saturday}</StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
