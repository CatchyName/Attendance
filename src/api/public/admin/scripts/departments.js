const container = document.getElementById("container");

const Departments = async () => {
    const departments = await GetDepartments();
    departments.forEach(department => {
        const par = document.createElement("p");
        const link = document.createElement("a");
        link.href = "/admin/department.html?department=" + department;
        link.innerHTML = department;
        par.appendChild(link);
        container.appendChild(par);
    });
}

CheckSession();
Departments();