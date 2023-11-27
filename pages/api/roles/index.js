import fs from "fs";
import path from "path";

export function buildRolesPath() {
  return path.join(process.cwd(), "data", "roles.json");
}

export function extractRoles(filePath) {
  const fileData = fs.readFileSync(filePath);
  const data = JSON.parse(fileData);
  return data;
}

export default function handler(req, res) {
  if (req.method === "GET") {
    const filePath = buildRolesPath();
    const data = extractRoles(filePath);
    res.status(200).json({ roles: data });
  } else if (req.method === "POST") {
    // Create a new role
    const { roleName, roleDescription } = req.body;

    const filePath = buildRolesPath();
    const data = extractRoles(filePath);

    // Check for duplicate role names
    if (data.some((role) => role.roleName === roleName)) {
      res.status(400).json({ error: "Role name must be unique" });
    } else {
      const newRole = {
        id: data.length + 1,
        roleName,
        roleDescription: roleDescription || "",
      };

      data.push(newRole);

      fs.writeFileSync(filePath, JSON.stringify(data));
      res.status(200).json({ message: "Success!", role: newRole });
    }
  } else if (req.method === "PUT") {
  }
}
