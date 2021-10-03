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

}

const GetEmployee = async (employeeID) => {

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

const GetCenter = async (centerID) => {

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

const GetSubcenter = async (centerID, subID) => {

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
