var employeeData = [];
var ENDPOINT = "http://206.189.72.24:8000";

getEmployeeList = () => {
  toggleLoading("");
  $.get({
    url: `${ENDPOINT}/api/employee/list`,
    success: function(data, status) {
      employeeData = [...data];
      populateEmployeeDataIntoTable(employeeData, departmentData);
      toggleLoading("none");
    },
    error: function(xhr, status, error) {
      showToaster(error);
      toggleLoading("none");
    }
  });
};

populateEmployeeDataIntoTable = (data, depData) => {
  let html = "";
  let index = 1;
  $.each(data, function(key, value) {
    let matchedDepartment = depData.find(department => {
      return department.department_id === value.department;
    });
    html += `<tr>`;
    html += `<td> ${index++} </td>`;
    html += `<td> ${value.name} </td>`;
    html += `<td> ${value.contract_employee ? "Yes" : "No"} </td>`;
    html += `<td> ${value.age} </td>`;
    html += `<td> ${value.address} </td>`;
    html += `<td> ${(matchedDepartment && matchedDepartment.name) ||
      "-"} </td>`;
    html += `<td><a href="javascript:void(0)" class="mr-2" onclick="editEmployee('${value.employee_id}')">Edit</a> | <a href="javascript:void(0)" onclick="deleteEmployee('${value.employee_id}')">Delete</a></td>`;
    html += `</tr>`;
  });
  $("#employeeTable tbody").html(html);
};

createEmployee = () => {
  if(!validateEmployee()) {
    return;
  }
  toggleLoading("");
  $.post({
    url: `${ENDPOINT}/api/employee/add`,
    data: {
      name: document.employeeForm.employeeName.value,
      contract_employee: document.employeeForm.contractEmployee.value,
      age: document.employeeForm.employeeAge.value,
      department: document.employeeForm.employeeDepartment.getAttribute("dept_id"),
      address: document.employeeForm.employeeAddress.value
    },
    success: function(data, status) {
      toggleLoading("none");
      showToaster("Employee has been Created!");
      getEmployeeList();
      closeEmployeeForm();
    },
    error: function(xhr, status, error) {
      showToaster(error);
      toggleLoading("none");
    }
  });
};

editEmployee = _employee => {
  let selectedEmployee = employeeData.find(employee => {
    return _employee === employee.employee_id;
  });
  document.employeeForm.createEmployeeButton.style.display = "none";
  document.employeeForm.updateEmployeeButton.style.display = "";
  openEmployeeForm(selectedEmployee);
};

newEmployeeForm = () => {
  document.employeeForm.createEmployeeButton.style.display = "";
  document.employeeForm.updateEmployeeButton.style.display = "none";
  openEmployeeForm();
};

updateEmployee = () => {
  if(!validateEmployee()) {
    return;
  }
  _employee = document.employeeForm.employeeId.value;
  toggleLoading("");
  $.post({
    url: `${ENDPOINT}/api/employee/interact/${_employee}`,
    data: {
      name: document.employeeForm.employeeName.value,
      contract_employee: document.employeeForm.contractEmployee.value,
      age: document.employeeForm.employeeAge.value,
      department: document.employeeForm.employeeDepartment.getAttribute("dept_id"),
      address: document.employeeForm.employeeAddress.value
    },
    success: function(data, status) {
      toggleLoading("none");
      showToaster("Employee has been Updated!");
      getEmployeeList();
      closeEmployeeForm();
    },
    error: function(xhr, status, error) {
      showToaster(error);
      toggleLoading("none");
    }
  });
};

deleteEmployee = _employee => {
  toggleLoading("");
  $.delete(`${ENDPOINT}/api/employee/interact/${_employee}`, function(
    data,
    status
  ) {
    showToaster("Employee has been Deleted!");
    getEmployeeList();
    toggleLoading("none");
  });
};

openEmployeeForm = employee => {
  $("#employeeDepartment").autocomplete({
    source: departmentData.map(department => department.name),
	 select: function (event, ui) {
        $("#employeeDepartment").val(ui.item.name); // display the selected text
        $("#employeeDepartment").attr('dept_id', departmentData.find((dep)=> { return dep.name === ui.item.value}).department_id); // save selected id to hidden input
    }
  });
  if (employee) {
    document.employeeForm.employeeId.value = employee.employee_id;
    document.employeeForm.employeeName.value = employee.name;
    document.employeeForm.contractEmployee.checked =
      employee.contract_employee;
    document.employeeForm.employeeAge.value = employee.age;
    document.employeeForm.employeeAddress.value = employee.address;
    const department = departmentData.find((dep)=> { return dep.department_id === employee.department});
    document.employeeForm.employeeDepartment.value = department.name;
    document.employeeForm.employeeDepartment.setAttribute("dept_id", employee.department);
  } else {
    document.employeeForm.employeeId.value = "";
    document.employeeForm.employeeName.value = "";
    document.employeeForm.contractEmployee.checked = false;
    document.employeeForm.employeeAge.value = "";
    document.employeeForm.employeeAddress.value = "";
    document.employeeForm.employeeDepartment.value = "";
  }
  document.getElementById("employeeForm").style.display = "block";
};

closeEmployeeForm = () => {
  document.getElementById("employeeForm").style.display = "none";
};

validateEmployee = () => {
  let isFormValidate = true;
  if (document.employeeForm.employeeName.value == "") {
    document.getElementById("eNameError").innerHTML =
      "Please provide valid Department name";
    document.employeeForm.employeeName.focus();
    isFormValidate = false;
  } else document.getElementById("eNameError").innerHTML = "";

  if (document.employeeForm.employeeAge.value == "") {
    document.getElementById("eAgeError").innerHTML =
      "Please provide valid Age";
    document.employeeForm.employeeAge.focus();
    isFormValidate = false;
  } else document.getElementById("eAgeError").innerHTML = "";

  if (document.employeeForm.employeeAddress.value == "") {
    document.getElementById("eAddrError").innerHTML =
      "Please provide valid Address";
    document.employeeForm.employeeAddress.focus();
    isFormValidate = false;
  } else document.getElementById("eAddrError").innerHTML = "";

  if (document.employeeForm.employeeDepartment.value == "") {
    document.getElementById("eDeptError").innerHTML =
      "Please select Department";
    document.employeeForm.employeeDepartment.focus();
    isFormValidate = false;
  } else document.getElementById("eDeptError").innerHTML = "";

  if(!isFormValidate) {
    return false;
  }

  return true;
};

resetEmployeeFormErrors = () => {
  document.getElementById("eNameError").innerHTML = "";
  document.getElementById("eAgeError").innerHTML = "";
  document.getElementById("eAddrError").innerHTML = "";
  document.getElementById("eDeptError").innerHTML = "";
};


function isNumber(evt) {
  var iKeyCode = (evt.which) ? evt.which : evt.keyCode
  if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
      return false;

  return true;
}   

var eform = document.getElementById("employeeForm");
eform.addEventListener('change', function() {
  resetEmployeeFormErrors();
});
