import { buildRolesPath, extractRoles } from ".";
import fs from "fs";
import { buildUsersPath, extractUsers } from "../users";

function handler(req, res) {
  if (req.method === "GET") {
    const roleId = req.query.roleId;
    const filePath = buildRolesPath();
    const data = extractRoles(filePath);
    const selectedRole = data.find((role) => role.id == roleId);
    res.status(200).json({ role: selectedRole });
  } else if (req.method === "PUT") {
    const filePath = buildRolesPath();
    const data = extractRoles(filePath);

    // Update an existing role
    const { roleId } = req.query;
    const { roleName, roleDescription } = req.body;

    const roleIndex = data.findIndex((role) => role.id === parseInt(roleId));

    if (roleIndex === -1) {
      res.status(404).json({ error: "Role not found" });
    } else if (
      data.some((role) => {
        role.roleName === roleName && role.id !== roleId;
      })
    ) {
      res.status(400).json({ error: "Role name must be unique" });
    } else {
      const updatedRole = {
        ...data[roleIndex],
        roleName: roleName || data[roleIndex].roleName,
        roleDescription: roleDescription || data[roleIndex].roleDescription,
      };

      const beforeUpdatingRole = data[roleIndex];

      data[roleIndex] = updatedRole;

      const usersFilePath = buildUsersPath(); // Assuming you have a function for building the users file path
      const usersData = extractUsers(usersFilePath);

      usersData.forEach((user) => {
        // Check if the user has the role being updated
        if (user.roleName === beforeUpdatingRole.roleName) {
          user.roleName = updatedRole.roleName;
        }
      });

      fs.writeFileSync(usersFilePath, JSON.stringify(usersData));

      fs.writeFileSync(filePath, JSON.stringify(data));
      res.status(200).json({ message: "Success!", role: updatedRole });
    }
  }
}

export default handler;
