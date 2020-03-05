var departmentData = [];
var ENDPOINT = "http://206.189.72.24:8000";

toggleLoading = display => {
  document.getElementById("loading").style.display = display;
};

showToaster = message => {
  $(".toast").toast("show");
  $(".toast .toast-body").html(message);
};

getDepartmentList = () => {
  toggleLoading("");
  $.get({
    url: `${ENDPOINT}/api/department/list`,
    success: function(data, status) {
      toggleLoading("none");

      departmentData = [...data];
      populateDepartmentDataIntoTable(departmentData);
      getEmployeeList();
    },
    error: function(xhr, status, error) {
      showToaster(error || "Unable to Get Department List");
      toggleLoading("none");
    }
  });
};

populateDepartmentDataIntoTable = data => {
  let html = "";
  let index = 1;
  $.each(data, function(key, value) {
    html += `<tr>`;
    html += `<td> ${index++} </td>`;
    html += `<td> ${value.name} </td>`;
    html += `<td> ${formatDate(value.created_at)} </td>`;
    html += `<td> ${formatDate(value.updated_at)} </td>`;
    html += `<td><a href="javascript:void(0)" class="mr-2" onclick="editDepartment('${value.department_id}')">Edit</a> | <a href="javascript:void(0)" onclick="deleteDepartment('${value.department_id}')">Delete</a></td>`;
    html += `</tr>`;
  });
  $("#departmentTable tbody").html(html);
};

createDepartment = () => {
  if (!validateDepartment()) {
    return false;
  }
  toggleLoading("");
  $.post({
    url: `${ENDPOINT}/api/department/add`,
    data: {
      name: document.departmentForm.departmentName.value
    },
    success: function(data, status) {
      toggleLoading("none");
      showToaster("Department has been Created!");
      getDepartmentList();
      closeDepartmentForm();
    },
    error: function(xhr, status, error) {
      toggleLoading("none");
      showToaster(error || "Unable to Create Department");
    }
  });
};

editDepartment = _department => {
  let selectedDepartment = departmentData.find(department => {
    return _department === department.department_id;
  });
  document.departmentForm.createDepartmentButton.style.display = "none";
  document.departmentForm.updateDepartmentButton.style.display = "";
  openDepartmentForm(selectedDepartment);
};

updateDepartment = () => {
  if (!validateDepartment()) {
    return;
  }
  let _department = document.departmentForm.departmentId.value;
  toggleLoading("");
  $.post({
    url: `${ENDPOINT}/api/department/interact/${_department}`,
    data: {
      name: document.departmentForm.departmentName.value
    },
    success: function(data, status) {
      toggleLoading("none");
      showToaster("Department has been Updated!");
      getDepartmentList();
      closeDepartmentForm();
    },
    error: function(xhr, data, error) {
      showToaster(error || "Unable to Update Department");
      toggleLoading("none");
    }
  });
};

deleteDepartment = _department => {
  toggleLoading("");

  $.delete(`${ENDPOINT}/api/department/interact/${_department}`, function(
    data,
    status
  ) {
    toggleLoading("none");
    showToaster("Department has been Deleted!");
    getDepartmentList();
  });
};

newDepartment = () => {
  document.departmentForm.createDepartmentButton.style.display = "";
  document.departmentForm.updateDepartmentButton.style.display = "none";
  openDepartmentForm();
};

openDepartmentForm = department => {
  if (department) {
    document.departmentForm.departmentName.value = department.name;
    document.departmentForm.departmentId.value = department.department_id;
  } else {
    document.departmentForm.departmentName.value = "";
    document.departmentForm.departmentId.value = "";
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
};

jQuery.each(["delete"], function(i, method) {
  jQuery[method] = function(url, data, callback, type) {
    if (jQuery.isFunction(data)) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback,
      error: function(xhr, status, error) {
        showToaster(error || "Unable to Delete");
      }
    });
  };
});

validateDepartment = () => {
  if (document.departmentForm.departmentName.value == "") {
    document.getElementById("dNameError").innerHTML =
      "Please provide valid Department name";
    document.departmentForm.departmentName.focus();
    return false;
  } else document.getElementById("dNameError").innerHTML = "";

  return true;
};

resetDepartmentFormErrors = () => {
  document.getElementById("dNameError").innerHTML = "";
};

var dform = document.getElementById("departmentForm");
dform.addEventListener('change', function() {
  validateDepartment();
});