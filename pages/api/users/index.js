import fs from "fs";
import path from "path";

export function buildUsersPath() {
  return path.join(process.cwd(), "data", "users.json");
}

export function extractUsers(filePath) {
  const fileData = fs.readFileSync(filePath);
  const data = JSON.parse(fileData);
  return data;
}

export default function handler(req, res) {
  if (req.method === "GET") {
    const filePath = buildUsersPath();
    const data = extractUsers(filePath);
    res.status(200).json({ roles: data });
  } else if (req.method === "POST") {
    // Create a new role
    const { firstName, lastName, emailAddress, roleName } = req.body;

    const filePath = buildUsersPath();
    const data = extractUsers(filePath);

    console.log(req.body);

    const newUser = {
      id: data.length + 1,
      firstName,
      lastName,
      emailAddress,
      roleName,
    };

    data.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(data));
    res.status(200).json({ message: "Success!", user: newUser });
  } else if (req.method === "PUT") {
  }
}
