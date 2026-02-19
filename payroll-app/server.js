const express = require("express");
const { readEmployees, writeEmployees } = require("./modules/fileHandler");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// ================= DASHBOARD =================
app.get("/", async (req, res) => {
  const employees = await readEmployees();

  // ===== SUMMARY CALCULATIONS =====
  const totalEmployees = employees.length;

  const totalSalary = employees.reduce((sum, emp) => {
    return sum + emp.salary;
  }, 0);

  const totalTax = totalSalary * 0.12;
  const totalNet = totalSalary - totalTax;

  // ✅ Calculate Average Salary
  const avgSalary =
    totalEmployees > 0 ? totalSalary / totalEmployees : 0;

  // ✅ Calculate Department Count
  const departments = [
    ...new Set(employees.map(emp => emp.department))
  ];
  const departmentCount = departments.length;

  // ===== SEND DATA TO EJS =====
  res.render("index", {
    employees,
    totalEmployees,
    totalSalary,
    totalTax,
    totalNet,
    avgSalary,
    departmentCount
  });
});

// ================= ADD EMPLOYEE =================
app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  let employees = await readEmployees();

  const newEmployee = {
    id: Date.now(),
    name: req.body.name,
    department: req.body.department,
    salary: Number(req.body.salary)
  };

  employees.push(newEmployee);
  await writeEmployees(employees);

  res.redirect("/");
});

// ================= DELETE EMPLOYEE =================
app.get("/delete/:id", async (req, res) => {
  let employees = await readEmployees();
  const id = Number(req.params.id);

  employees = employees.filter(emp => emp.id !== id);
  await writeEmployees(employees);

  res.redirect("/");
});

// ================= EDIT EMPLOYEE =================
app.get("/edit/:id", async (req, res) => {
  const employees = await readEmployees();
  const id = Number(req.params.id);

  const employee = employees.find(emp => emp.id === id);
  res.render("edit", { employee });
});

app.post("/edit/:id", async (req, res) => {
  let employees = await readEmployees();
  const id = Number(req.params.id);

  employees = employees.map(emp => {
    if (emp.id === id) {
      return {
        id: id,
        name: req.body.name,
        department: req.body.department,
        salary: Number(req.body.salary)
      };
    }
    return emp;
  });

  await writeEmployees(employees);
  res.redirect("/");
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

