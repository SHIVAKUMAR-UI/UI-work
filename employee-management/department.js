var departmentData = [];
var ENDPOINT = "";
function viewDepartment() {}

function getDepartmentList() {
  console.log("Get department List");

  //   $.get(`${ENDPOINT}/api/department/list`, function(data, status){

  //   });

  departmentData = [
    {
      department_id: "6f4628ff-11c9-4ba7-98cd-1909383ce578",
      name: "Operations",
      created_at: "2020-02-05T05:50:40.610441Z",
      updated_at: "2020-02-05T05:50:40.610503Z"
    },
    {
      department_id: "6f4628ff-11c9-4ba7-98cd-1909383ce570",
      name: "Operations",
      created_at: "2020-02-05T05:50:40.610441Z",
      updated_at: "2020-02-05T05:50:40.610503Z"
    }
  ];

  let html = "";
  let index = 1;
  $.each(departmentData, function(key, value) {
    html += `<tr>`;
    html += `<td> ${index++} </td>`;
    html += `<td> ${value.name} </td>`;
    html += `<td> ${formatDate(value.created_at)} </td>`;
    html += `<td> ${formatDate(value.updated_at)} </td>`;
    html += `<td><a href="javascript:void(0)" class="mr-2" onclick="editDepartment('${value.department_id}')">Edit</a><a href="javascript:void(0)" onclick="deleteDepartment('${value.department_id}')">Delete</a></td>`;
    html += `</tr>`;
  });
  $("#departmentTable tbody").html(html);
}

function createDepartment() {
  console.log("createDepartment");
  $.post(
    `${ENDPOINT}/api/department/add`,
    {
      name: document.getElementById("departmentName").value
    },
    function(data, status) {
      console.log(data);
    }
  );
  getDepartmentList();
}

function editDepartment(_department) {
  console.log("editDepartment", _department);
  console.log("data", departmentData);
  let selectedDepartment = departmentData.find(department => {
    return _department === department.department_id;
  });

  openDepartmentForm(selectedDepartment);
}

function updateDepartment(_department) {
  console.log("updateDepartment", _department);
  $.put(
    `${ENDPOINT}/api/department/interact/${_department}`,
    {
      name: document.getElementById("departmentName").value
    },
    function(data, status) {
      console.log(data);
      getDepartmentList();
    }
  );
}

function deleteDepartment(_department) {
  console.log("deleteDepartment");
  $.delete(`${ENDPOINT}/api/department/interact/${_department}`, function(
    data,
    status
  ) {
    console.log(data);
    getDepartmentList();
  });
}

function openDepartmentForm(department) {
  console.log("openDepartmentForm department", department);
  if (department) {
    document.getElementById("departmentName").value = department.name;
  }
  document.getElementById("departmentForm").style.display = "block";
}

function closeDepartmentForm() {
  document.getElementById("departmentForm").style.display = "none";
}

function formatDate(fullDate) {
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

jQuery.each(["put", "delete"], function(i, method) {
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
      success: callback
    });
  };
});
