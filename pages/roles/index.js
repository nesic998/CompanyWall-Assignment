import Navbar from "@/components/ui/Navbar";
import TableGenerator from "@/components/ui/TableGenerator";
import React, { useEffect, useState } from "react";

export default function Roles() {
  return (
    <div className="main-wrapper">
      <Navbar />

      <div className="role-wrapper">
        <TableGenerator />
      </div>
    </div>
  );
}
