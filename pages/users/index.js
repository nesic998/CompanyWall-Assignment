import Navbar from "@/components/ui/Navbar";
import TableGenerator from "@/components/ui/TableGenerator";
import React from "react";

export default function Users() {
  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="users-wrapper">
        <TableGenerator />
      </div>
    </div>
  );
}
