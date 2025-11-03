
import { students } from "./index";

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const studentId = parseInt(id);

  if (method === "PUT") {
    const { name, email } = req.body;
    const index = students.findIndex((s) => s.id === studentId);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], name, email };
    res.status(200).json(students[index]);
  } else if (method === "DELETE") {
    const index = students.findIndex((s) => s.id === studentId);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    students.splice(index, 1);
    res.status(200).json({ message: "Deleted successfully" });
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
