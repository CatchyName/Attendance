const container = document.getElementById("container");

const Centers = async () => {
    const centers = await GetCenters();
    centers.forEach(center => {
        const par = document.createElement("p");
        const link = document.createElement("a");
        link.href = "/admin/center.html?center=" + center;
        link.innerHTML = center;
        par.appendChild(link);
        container.appendChild(par);
    });
}

Centers();