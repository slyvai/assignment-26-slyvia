export let students = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(students);
  } else if (req.method === "POST") {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const newStudent = {
      id: students.length ? students[students.length - 1].id + 1 : 1,
      name,
      email,
    };

    students.push(newStudent);
    res.status(201).json(newStudent);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
