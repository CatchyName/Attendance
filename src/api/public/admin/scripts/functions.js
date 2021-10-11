const CheckSession = async () => {
    let response = await fetch("/admin/check", {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    if (response.code !== 0) {
        window.location = "/admin/login.html";
        return false;
    }
    return true;
}

const GetEmployees = async () => {
    let response = await fetch("/admin/getemployees", {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";
    if (response.code !== 0) return false;
    return response.data
}

const GetEmployeesData = async () => {
    let response = await fetch("/admin/getemployeesdata", {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";
    if (response.code !== 0) return false;
    return response.data
}

const GetEmployeesFromCenter = async (CenterName) => {
    let response = await fetch("/admin/getemployeedatafromcenter", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            centername: CenterName
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetEmployeesFromDepartment = async (DepartmentName) => {
    let response = await fetch("/admin/getemployeedatafromdepartment", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            departmentname: DepartmentName
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetEmployeeData = async (employeeID) => {
    let response = await fetch("/admin/getemployeedata", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeID: employeeID
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetCenters = async () => {
    let response = await fetch("/admin/getcenters", {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetAllSubcenters = async () => {
    let response = await fetch("/admin/getallsubcenters", {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetSubcenters = async (centerID) => {
    let response = await fetch("/admin/getsubcenters", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            centerID: centerID
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetCenterName = async (centerID) => {
    let response = await fetch("/admin/getcenter", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            centerID: centerID
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetSubcenterName = async (centerID, subcenterID) => {
    let response = await fetch("/admin/getsubcenter", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            centerID: centerID,
            subcenterID, subcenterID
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetDepartmentName = async (departmentID) => {
    let response = await fetch("/admin/getdepartment", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            departmentID, departmentID
        })
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetDepartments = async () => {
    let response = await fetch("/admin/getdepartments", {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) return response.data;
    else return false;
}

const GetDepartment = async (depID) => {

}
