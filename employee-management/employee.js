var employeeData = [];
var ENDPOINT = [];
function viewEmployee() {
  console.log("viewEmployee");
}

function getEmployeeList() {
  console.log("getEmployeeList");
  //     $.get(`${ENDPOINT}/api/employee/add`, function(data, status){

  //   });

  employeeData = [
    {
      employee_id: "0805ffc3-3751-4199-926f-fe5545d2a1b2",
      name: "M James",
      contract_employee: false,
      age: 29,
      address: "52, Jefferson Street, NY",
      department: null
    },
    {
      employee_id: "ee48d086-cd70-4465-9cb8-5bacf26c4295",
      name: "M James",
      contract_employee: false,
      age: 29,
      address: "52, Jefferson Street, NY",
      department: "6f4628ff-11c9-4ba7-98cd-1909383ce578"
    }
  ];

  let html = "";
  let index = 1;
  $.each(employeeData, function(key, value) {
    console.log("departmentData", departmentData);
    let matchedDepartment = departmentData.find(department => {
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
}

function createEmployee() {
  console.log("createEmployee");

  $.post(
    `${ENDPOINT}/api/employee/list`,
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
}

function editEmployee(_employee) {
  console.log("editDepartment", _employee);
  console.log("data", employeeData);
  let selectedEmployee = employeeData.find(employee => {
    return _employee === employee.employee_id;
  });

  openEmployeeForm(selectedEmployee);
}

function updateEmployee(_employee) {
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
}

function deleteEmployee(_employee) {
  console.log("deleteEmployee");
  //   $.delete(`${ENDPOINT}/api/employee/interact/${_employee}`, function(data, status){

  //   });
  getEmployeeList();
}

function openEmployeeForm(employee) {
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
  }
  document.getElementById("employeeForm").style.display = "block";
}

function closeEmployeeForm() {
  document.getElementById("employeeForm").style.display = "none";
}
