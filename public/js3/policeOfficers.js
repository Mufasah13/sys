// police table scripts
fetch("/api/police")
.then((response) => response.json())
.then(data => {
    const loading = document.getElementById('loading')
    loading.style.display
     = 'none';
    const tableBody = document.getElementById("table-body");

    data.forEach((item) => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        const officerNoCell = row.insertCell();
        const caseAssignedCell = row.insertCell()
        nameCell.innerText = item.name;
        officerNoCell.innerText = item.regNo;
        caseAssignedCell.innerText = item.caseAssigned;
    });
});

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', filterTable);

// query search
function filterTable() {
  let searchText = document.getElementById('search-input').value.toLowerCase();
  let tableBody = document.getElementById("table-body");
  let rows = tableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName('td');
    let rowMatchesSearch = false;

    for (let j = 0; j < cells.length; j++) {
      let cellText = cells[j].textContent.toLowerCase();

      if (cellText.includes(searchText)) {
        rowMatchesSearch = true;
        break;
      }
    }

    if (rowMatchesSearch) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}


// clearing the query
function resetTable() {
  let tableBody = document.getElementById("table-body");
  let rows = tableBody.getElementsByTagName('tr')
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = '';
  }
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  if (searchInput.value === '') {
    resetTable();
  } else {
    filterTable();
  }
});

