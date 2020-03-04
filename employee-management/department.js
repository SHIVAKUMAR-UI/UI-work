var departmentData = [];
var ENDPOINT = "http://206.189.72.24:8000";

viewDepartment = () => {}

function getDepartmentList() {
  console.log("Get department List");

  $.get(`${ENDPOINT}/api/department/list`, function(data, status) {
    departmentData = [...data];
    populateDepartmentDataIntoTable(departmentData);
    getEmployeeList();
  });
}

populateDepartmentDataIntoTable = data => {
  let html = "";
  let index = 1;
  $.each(data, function(key, value) {
    html += `<tr>`;
    html += `<td> ${index++} </td>`;
    html += `<td> ${value.name} </td>`;
    html += `<td> ${formatDate(value.created_at)} </td>`;
    html += `<td> ${formatDate(value.updated_at)} </td>`;
    html += `<td><a href="javascript:void(0)" class="mr-2" onclick="editDepartment('${value.department_id}')">Edit</a><a href="javascript:void(0)" onclick="deleteDepartment('${value.department_id}')">Delete</a></td>`;
    html += `</tr>`;
  });
  $("#departmentTable tbody").html(html);
};

createDepartment = () => {
  console.log("createDepartment");
  $.post(
    `${ENDPOINT}/api/department/add`,
    {
      name: document.getElementById("departmentName").value
    },
    function(data, status) {
      console.log(data);
      getDepartmentList();
      closeDepartmentForm();
    }
  );
}

editDepartment = _department => {
  console.log("editDepartment", _department);
  console.log("data", departmentData);
  let selectedDepartment = departmentData.find(department => {
    return _department === department.department_id;
  });
  document.getElementById("createDepartmentButton").style.display = "none";
  document.getElementById("updateDepartmentButton").style.display = "";
  openDepartmentForm(selectedDepartment);
}

updateDepartment = () => {
  let _department = document.getElementById("departmentId").value;
  console.log("updateDepartment", _department);
  $.post({
    url: `${ENDPOINT}/api/department/interact/${_department}`,
    data: {
      name: document.getElementById("departmentName").value
    },
    success: function(data, status) {
      console.log(data);
      getDepartmentList();
      closeDepartmentForm();
    },
    error: function(xhr, data, error) {
      console.log("error", error);
    }
  });
}

deleteDepartment = _department => {
  console.log("deleteDepartment");
  $.delete(`${ENDPOINT}/api/department/interact/${_department}`, function(
    data,
    status
  ) {
    console.log(data);
    getDepartmentList();
  });
}

newDepartment = () => {
  document.getElementById("createDepartmentButton").style.display = "";
  document.getElementById("updateDepartmentButton").style.display = "none";
  openDepartmentForm();
};

openDepartmentForm = department => {
  console.log("openDepartmentForm department", department);
  if (department) {
    document.getElementById("departmentName").value = department.name;
    document.getElementById("departmentId").value = department.department_id;
  } else {
    document.getElementById("departmentName").value = "";
    document.getElementById("departmentId").value = "";
  }
  document.getElementById("departmentForm").style.display = "block";
};

closeDepartmentForm = () => {
  document.getElementById("departmentForm").style.display = "none";
};

formatDate = fullDate => {
  let formattedDate = new Date(fullDate);
  let dd = formattedDate.getDate();

  let mm = formattedDate.getMonth() + 1;
  let yyyy = formattedDate.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  formattedDate = mm + "-" + dd + "-" + yyyy;
  return formattedDate;
}

// jQuery.each(["delete"], function(i, method) {
//   jQuery[method] = function(url, data, callback, type) {
//     if (jQuery.isFunction(data)) {
//       type = type || callback;
//       callback = data;
//       data = undefined;
//     }

//     return jQuery.ajax({
//       url: url,
//       type: method,
//       dataType: type,
//       data: data,
//       success: callback
//     });
//   };
// });
