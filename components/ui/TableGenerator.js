import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Image from "next/image";

import editIcon from "../../public/images/edit.svg";
import Link from "next/link";
import { Button, TablePagination, TableSortLabel } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TableGenerator() {
  const router = useRouter();

  const [orderBy, setOrderBy] = useState("roleName");
  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(0); // Added state for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Added state for rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [data, setData] = useState([]);

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a[orderBy], b[orderBy])
      : (a, b) => -descendingComparator(a[orderBy], b[orderBy]);
  };

  const descendingComparator = (a, b) => {
    if (b < a || a === null) return -1;
    if (a < b || b === null) return 1;
    return 0;
  };

  const createSortHandler = (property) => (event) => {
    handleSortRequest(property);
  };

  useEffect(() => {
    if (router.pathname === "/roles") {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/roles");
          const data = await response.json();
          setData(data.roles);
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };

      fetchData();
    } else {
      setOrderBy("id");
      setOrder("desc");

      const fetchData = async () => {
        try {
          const response = await fetch("/api/users");
          const data = await response.json();
          setData(data.roles);
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <TableContainer component={Paper}>
      <Link
        style={{ textDecoration: "none", color: "red", marginBottom: "20px" }}
        href={router.pathname === "/roles" ? "/roles/create" : "/users/create"}
      >
        <Button
          sx={{ m: "20px 0px 20px 30px" }}
          color="success"
          variant="contained"
        >
          Create
        </Button>
      </Link>

      <Table className="table" sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {router.pathname === "/roles" ? (
              <>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "roleName"}
                    direction={orderBy === "roleName" ? order : "asc"}
                    onClick={createSortHandler("roleName")}
                  >
                    Role Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Role description</TableCell>
                <TableCell>Actions</TableCell>
              </>
            ) : router.pathname === "/users" ? (
              <>
                <TableCell>
                  {" "}
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "desc"}
                    onClick={createSortHandler("id")}
                  >
                    Row number
                  </TableSortLabel>
                </TableCell>

                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell>Email address</TableCell>
                <TableCell>Role name</TableCell>
                <TableCell>Actions</TableCell>
              </>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(data, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Added slicing based on current page and rowsPerPage
            .map((row) => (
              <TableRow key={row.id}>
                {router.pathname === "/roles" ? (
                  <>
                    <TableCell>{row.roleName}</TableCell>
                    <TableCell>{row.roleDescription}</TableCell>
                    <TableCell>
                      <Link href={`/roles/update/${row.id}`}>
                        <Image
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                          alt="update"
                          src={editIcon}
                        ></Image>{" "}
                      </Link>
                    </TableCell>
                  </>
                ) : router.pathname === "/users" ? (
                  <>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.emailAddress}</TableCell>
                    <TableCell>{row.roleName}</TableCell>
                    <TableCell>
                      <Link href={`/users/update/${row.id}`}>
                        <Image
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                          alt="update"
                          src={editIcon}
                        ></Image>{" "}
                      </Link>
                    </TableCell>
                  </>
                ) : null}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]} // Customize rows per page options as needed
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
