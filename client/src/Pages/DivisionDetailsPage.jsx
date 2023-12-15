import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Components/Loading";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const fetchDivision = (divID) => {
  return fetch(`/api/divisions/${divID}`).then((res) => res.json());
};

export default function DivisionDetailsPage() {
  const { id } = useParams();
  const [employees, setEmployees] = useState([]);
  const [division, setDivision] = useState("");
  const [manager, setManager] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDivision(id)
      .then((division) => {
        setDivision(division);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        const employeesOfDivision = employees.filter(
          (emp) => emp.division === division._id
        );
        return employeesOfDivision;
      })
      .then((empsDiv) => {
        const filterForBoss = empsDiv.filter(
          (emp) => emp._id === division.boss
        );
        const boss = filterForBoss.map((boss) =>
          Object.values(boss.name).join(" ")
        );
        setEmployees(empsDiv);
        setManager(boss);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [division._id, division.boss]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>{division.name}</h1>
      <div
        className="divisionDetails-container"
        style={{ display: "inline-block" }}
      >
        <label
          className="divisionDetails-labels"
          style={{ fontWeight: "bold" }}
        >
          LOCATION:
        </label>
        <br />
        <div>{Object.values(division.location).join(", ")}</div>
      </div>
      <br />
      <div
        className="divisionDetails-container"
        style={{ display: "inline-block" }}
      >
        <label
          className="divisionDetails-labels"
          style={{ fontWeight: "bold" }}
        >
          ANNUAL BUDGET (including salaries):
        </label>
        <br />
        <div>{`${Number(
          employees.reduce((acc, current) => acc + current.currentSalary, 0) +
            division.budget
        )} $`}</div>
      </div>
      <br />
      <div
        className="divisionDetails-container"
        style={{ display: "inline-block" }}
      >
        <label
          className="divisionDetails-labels"
          style={{ fontWeight: "bold" }}
        >
          Manager:
        </label>
        <br />
        <div>{manager}</div>
      </div>
      <br />
      <div
        className="divisionDetails-container"
        style={{ display: "inline-block" }}
      >
        <label
          className="divisionDetails-labels"
          style={{ fontWeight: "bold" }}
        >
          Number of Employees:
        </label>
        <br />
        <div>{employees.length}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Division employees</th>
            <th>Position</th>
            <th>Level</th>
            <th>Current Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{Object.values(emp.name).join(" ")}</td>
              <td>{emp.position}</td>
              <td>{emp.level}</td>
              <td>{`${emp.currentSalary} $`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
