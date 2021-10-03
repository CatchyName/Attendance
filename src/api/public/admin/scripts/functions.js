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

    if (response.code === 0) return response.data;
    else return false;
}

const GetCenter = async (centerID) => {

}

const GetSubcenters = async (centerID) => {

}

const GetSubcenter = async (centerID, subID) => {

}

const GetDepartments = async () => {

}

const GetDepartment = async (depID) => {

}
