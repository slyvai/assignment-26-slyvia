import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "students.json");

async function getStudents() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function saveStudents(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const studentId = parseInt(id);
  let students = await getStudents();

  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }


  if (method === "PUT") {
    const { name, email } = req.body;

    students[index] = {
      ...students[index],
      name: name ?? students[index].name,
      email: email ?? students[index].email,
    };

    await saveStudents(students);

    return res.status(200).json(students[index]);
  }


  if (method === "DELETE") {
    students.splice(index, 1);
    await saveStudents(students);

    return res.status(200).json({ message: "Deleted successfully" });
  }


  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
