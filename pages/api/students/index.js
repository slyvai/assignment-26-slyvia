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
  if (req.method === "GET") {
    const students = await getStudents();
    return res.status(200).json(students);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const students = await getStudents();

    const newStudent = {
      id: students.length ? students[students.length - 1].id + 1 : 1,
      name,
      email,
    };

    students.push(newStudent);

    await saveStudents(students);

    return res.status(201).json(newStudent);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
