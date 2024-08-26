const addPatient = document.getElementById("addPatient");
const report = document.getElementById("report");
const result = document.getElementById("result");
const btnSearch = document.getElementById("btnSearch");

const patients = [];

function reserform() {
  document.getElementById("name").value = "";
  document.querySelector("input[gender]:checked").checked = false;
  document.getElementById("age").value = "";
  document.getElementById("condition").value = "";
}

function addPatientForm() {
  try {
    const name = document.getElementById("name").value;
    const gender = document.querySelector("input[gender]:checked");
    const age = parseInt(document.getElementById("age").value);
    const condition = document.getElementById("condition").value;

    if (!name) throw "Name must be required";
    if (!gender) throw "Gender must be required";
    if (!age) throw "Age must be required";
    if (!condition) throw "Condition must be required";

    patients.push({
      name: name,
      gender: gender.value,
      age: age,
      condition: condition,
    });
    generateReport();
    reserform();
  } catch (err) {
    console.log(err);
  }
}

function generateReport() {
  const numPatients = patients.length;
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };
  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };
  for (const patient of patients) {
    conditionsCount[patient.condition]++;
    genderConditionsCount[patient.gender][patient.condition]++;
  }
  report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
  report.innerHTML += `Conditions Breakdown:<br>`;
  for (const condition in conditionsCount) {
    report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
  }
  report.innerHTML += `<br>Gender-Based Conditions:<br>`;
  for (const gender in genderConditionsCount) {
    report.innerHTML += `${gender}:<br>`;
    for (const condition in genderConditionsCount[gender]) {
      report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
    }
  }
  const addCSS = (css) =>
    (document.head.appendChild(document.createElement("style")).innerHTML =
      css);

  // Usage:
  addCSS(`.report-border {
  border: #ebebeb solid 1px;
  padding: 1rem;
}
`);
}

function searchCondition() {
  const input = document.getElementById("conditionInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  console.log(input);
  resultDiv.innerHTML = "";

  fetch("./health_analysis.json")
    .then((response) => response.json())
    .then((data) => {
      debugger;
      const condition = data.conditions.find(
        (item) => item.name.toLowerCase() == input
      );
      console.log(condition);
      //check kung meron
      if (condition) {
        const symptoms = condition.symptoms.join(",");
        const prevention = condition.prevention.join(",");
        const treatment = condition.treatment;

        resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
        resultDiv.innerHTML += `<img src="${condition.imagesrc}" class="img-size">`;
        resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
        resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
        resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
      } else {
        resultDiv.innerHTML = `Condition not found`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.innerHTML = "An error occured while fetching data";
    });
}

addPatient.addEventListener("click", () => {
  addPatientForm();
});

btnSearch.addEventListener("click", searchCondition);
