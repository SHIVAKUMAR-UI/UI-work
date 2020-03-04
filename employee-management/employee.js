var employeeData = [];
var ENDPOINT = "http://206.189.72.24:8000";

getEmployeeList = () => {
  console.log("getEmployeeList");
  $.get({
    url: `${ENDPOINT}/api/employee/list`,
    success: function(data, status) {
      employeeData = [...data];
      populateEmployeeDataIntoTable(employeeData, departmentData);
    },
    error: function(xhr, status, error) {
      console.log("xhr= ", xhr);
      console.log("status= ", status);
      console.log("error= ", error);
    }
  });
};

populateEmployeeDataIntoTable = (data, depData) => {
  let html = "";
  let index = 1;
  $.each(data, function(key, value) {
    console.log("departmentData", depData);
    let matchedDepartment = depData.find(department => {
      return department.department_id === value.department;
    });
    html += `<tr>`;
    html += `<td> ${index++} </td>`;
    html += `<td> ${value.name} </td>`;
    html += `<td> ${value.contract_employee} </td>`;
    html += `<td> ${value.age} </td>`;
    html += `<td> ${value.address} </td>`;
    html += `<td> ${(matchedDepartment && matchedDepartment.name) ||
      "-"} </td>`;
    html += `<td><a href="javascript:void(0)" class="mr-2" onclick="editEmployee('${value.employee_id}')">Edit</a><a href="javascript:void(0)" onclick="deleteEmployee('${value.employee_id}')">Delete</a></td>`;
    html += `</tr>`;
  });
  $("#employeeTable tbody").html(html);
};

createEmployee = () => {
  console.log("createEmployee");

  $.post({
    url: `${ENDPOINT}/api/employee/add`,
    data: {
      name: document.getElementById("employeeName").value,
      contract_employee: document.getElementById("contractEmployee").value,
      age: document.getElementById("employeeAge").value,
      department: document.getElementById("employeeAddress").value,
      address: document.getElementById("employeeDepartment").value
    },
    success: function(data, status) {
      console.log(data);

      getEmployeeList();
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
};

editEmployee = _employee => {
  console.log("editDepartment", _employee);
  console.log("data", employeeData);
  let selectedEmployee = employeeData.find(employee => {
    return _employee === employee.employee_id;
  });
  document.getElementById("createEmployeeButton").style.display = "none";
  document.getElementById("updateEmployeeButton").style.display = "";
  openEmployeeForm(selectedEmployee);
};

newEmployeeForm = () => {
  document.getElementById("createEmployeeButton").style.display = "";
  document.getElementById("updateEmployeeButton").style.display = "none";
  openEmployeeForm();
};

updateEmployee = _employee => {
  console.log("updateEmployee");
  $.put(
    `${ENDPOINT}/api/employee/interact/${_employee}`,
    {
      name: document.getElementById("employeeName").value,
      contract_employee: document.getElementById("contractEmployee").value,
      age: document.getElementById("employeeAge").value,
      department: document.getElementById("employeeAddress").value,
      address: document.getElementById("employeeDepartment").value
    },
    function(data, status) {
      console.log(data);
    }
  );
  getEmployeeList();
};

deleteEmployee = _employee => {
  console.log("deleteEmployee");
  $.delete({
    url: `${ENDPOINT}/api/employee/interact/${_employee}`,
    success: function(data, status) {
      getEmployeeList();
    },
    error: () => {}
  });
};

openEmployeeForm = employee => {
  $("#employeeDepartment").autocomplete({
    source: departmentData.map(department => department.name)
  });
  console.log("employee", employee);
  if (employee) {
    document.getElementById("employeeName").value = employee.name;
    document.getElementById("contractEmployee").value =
      employee.contract_employee;
    document.getElementById("employeeAge").value = employee.age;
    document.getElementById("employeeAddress").value = employee.address;
    document.getElementById("employeeDepartment").value = employee.department;
  } else {
    document.getElementById("employeeName").value = "";
    document.getElementById("contractEmployee").value = "";
    document.getElementById("employeeAge").value = "";
    document.getElementById("employeeAddress").value = "";
    document.getElementById("employeeDepartment").value = "";
  }
  document.getElementById("employeeForm").style.display = "block";
};

closeEmployeeForm = () => {
  document.getElementById("employeeForm").style.display = "none";
};
