import { buildUsersPath, extractUsers } from ".";
import fs from "fs";

function handler(req, res) {
  if (req.method === "GET") {
    const userId = req.query.userId;
    const filePath = buildUsersPath();
    const data = extractUsers(filePath);
    const selectedUser = data.find((user) => user.id == userId);
    res.status(200).json({ user: selectedUser });
  } else if (req.method === "PUT") {
    const filePath = buildUsersPath();
    const data = extractUsers(filePath);

    // Update an existing role
    const { userId } = req.query;
    const { firstName, lastName, emailAddress, roleName } = req.body;

    const userIndex = data.findIndex((user) => user.id === parseInt(userId));

    if (userIndex === -1) {
      res.status(404).json({ error: "Role not found" });
    }

    const updatedUser = {
      ...data[userIndex],
      firstName: firstName || data[userIndex].firstName,
      lastName: lastName || data[userIndex].lastName,
      emailAddress: emailAddress || data[userIndex].emailAddress,
      roleName: roleName || data[userIndex].roleName,
    };

    data[userIndex] = updatedUser;

    fs.writeFileSync(filePath, JSON.stringify(data));
    res.status(200).json({ message: "Success!", user: updatedUser });
  }
}

export default handler;
