import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 800,
    maxWidth: 1200,
    margin: 'auto'
  },
});

export default function GenericTable(props) {
  const classes = useStyles();
  const tableHeaders = props.columns.map((column) => {
    return <TableCell key={`header-${column}`}>{column}</TableCell>;
  });
  const tableHead = (
    <TableHead>
      <TableRow>{tableHeaders}</TableRow>
    </TableHead>
  );

  const rows = props.data.map((row) => {
    const key = row[props.keyColumn];
    const rowCells = props.columns.map((column) => {
      return <TableCell key={`${key}${column}`}>{row[column]}</TableCell>;
    });
    return <TableRow key={key}>{rowCells}</TableRow>;
  });

  const tableBody = <TableBody>{rows}</TableBody>;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        {tableHead}
        {tableBody}
      </Table>
    </TableContainer>
  );
}