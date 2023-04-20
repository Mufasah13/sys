// table scripts
fetch("/api/statements")
.then((response) => response.json())
.then(data => {
    const loading = document.getElementById('loading')
    loading.style.display
     = 'none';
    const tableBody = document.getElementById("table-body");
    const tableBodyComplete = document.getElementById("table-bodyComplete");

    data.forEach((item) => {
      if(!item.isClosed){
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        const idCell = row.insertCell();
        const crimeCell = row.insertCell();
        const caseId = row.insertCell();
        const victimCell = row.insertCell();
        const victimidCell = row.insertCell();
        nameCell.innerText = item.offenderName;
        idCell.innerText = item.offenderId;
        crimeCell.innerText = item.offenderCrime;
        caseId.innerText = item.caseId;
        victimCell.innerText = item.victimName;
        victimidCell.innerText = item.victimId;
      }else{
        const row = tableBodyComplete.insertRow();
        const nameCell = row.insertCell();
        const idCell = row.insertCell();
        const crimeCell = row.insertCell();
        const caseId = row.insertCell();
        const victimCell = row.insertCell();
        const victimidCell = row.insertCell();
        nameCell.innerText = item.offenderName;
        idCell.innerText = item.offenderId;
        crimeCell.innerText = item.offenderCrime;
        caseId.innerText = item.caseId;
        victimCell.innerText = item.victimName;
        victimidCell.innerText = item.victimId;
      }

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

function filterTableC() {
  let searchText = document.getElementById('search-inputC').value.toLowerCase();
  let tableBody = document.getElementById("table-bodyComplete");
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
function resetTableC() {
  let tableBody = document.getElementById("table-bodyComplete");
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

const searchInputc = document.getElementById('search-inputC');
searchInputc.addEventListener('input', () => {
  if (searchInputc.value === '') {
    resetTableC();
  } else {
    filterTableC();
  }
});
