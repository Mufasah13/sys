// police dashboard custom scripts

fetch('/api/task')
    .then(res => res.json())
    .then(data => {
        const loading = document.getElementById('loading')
        const loadin = document.getElementById('loadin')
        loading.style.display = 'none';
        const taskContainer  = document.getElementById("root-space")
        if(data && data.length > 0){
            data.forEach(caseData => {
                // console.log(caseData)
                loadin.style.display = "none"
                taskContainer.innerHTML += `
                <div class="card mb-4">
                    <!-- Card Header - Accordion -->
                    <a href="#${caseData.caseId}" class="d-block card-header py-3" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 font-weight-bold text-primary">Case ${caseData.caseId}</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id=${caseData.caseId}>
                        <div class="card-body">
                            ${caseData.statement}
                        </div>
                        <button type="button" data-Id=${caseData.caseId} class="btnClose">Submit Case</button>
                    </div>
                </div>
                `
            })
            const btnCloses = document.querySelectorAll('.btnClose');
            btnCloses.forEach((btnClose) => {
                btnClose.addEventListener('click', (e)=>{
                    const caseId = e.target.getAttribute("data-Id")
                    // console.log(caseId)
                    btnClose.disabled = true
                    btnClose.textContent = "Closed"

                    // Make a PUT request to update the database
                    fetch(`/api/task/${caseId}`, {
                        method: 'PUT',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                        isClosed: true
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('update successful:', data);
                        e.target.disabled = true; // disable the button after updating
                    })
                    .catch(error => {
                        console.error('update failed:', error);
                    });
                })
            });
        }else{
            document.getElementById('loadin').textContent = "Looks like there are no open cases assigned to you at the moment"
        }
    })
