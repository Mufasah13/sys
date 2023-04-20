// admin scripts
fetch('/api/open')
    .then(res => res.json())
    .then(data => {
        const loading1 = document.getElementById('loading1');
        const noCase = document.getElementById('noCase');
        loading1.style.display = 'none';
        if (data && data.length > 0) {
            data.forEach(data => {
                noCase.style.display = 'none';
                document.getElementById('root-open-cases').innerHTML += `
                <div class="card shadow mb-4">
                    <!-- Card Header - Accordion -->
                    <a href="#${data.caseId}" class="d-block card-header py-3" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 font-weight-bold">Case code: <span class="text-dark">${data.caseId}</span></h6>
                        <h6 class="m-0 font-weight-bold">Status: <span class="text-dark">${data.isClosed ? "Completed" : "Pending"}</span></h6>
                        </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="${data.caseId}">
                        <div class="card-body">
                            ${data.statement}
                        </div>
                        
                        <button type="button" data-id="${data.caseId}" class="closin">Close Case</button>
                    </div>
                </div>
                `;
            });
            const btnCloses = document.querySelectorAll('.closin');
            btnCloses.forEach((btnClose) => {
                btnClose.addEventListener('click', (e) => {
                    const caseId = e.target.getAttribute('data-id');
                    console.log(caseId);
                    btnClose.disabled = true;
                    btnClose.textContent = 'Closed';
                    fetch(`/api/close/${caseId}`, {
                        method: 'DELETE'
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(`Case ${caseId} has been closed`);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                });
            });
        } else {
            noCase.textContent = 'Looks like there are no open cases at the moment';
        }
    });
