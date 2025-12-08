const clientData = {};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("clientForm");
  const resetBtn = document.getElementById("resetBtn");
  const dataPreview = document.getElementById("dataPreview");

  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");

  const educationSelect = document.getElementById("education");
  const educationDetails = document.getElementById("educationDetails");

  const maritalStatusSelect = document.getElementById("maritalStatus");
  const maritalWarning = document.getElementById("maritalWarning");
  const spouseFields = document.getElementById("spouseFields");

  const professionalStatusSelect =
    document.getElementById("professionalStatus");
  const studyFields = document.getElementById("studyFields");
  const workFields = document.getElementById("workFields");
  const unemployedFields = document.getElementById("unemployedFields");
  const parentalLeaveFields = document.getElementById("parentalLeaveFields");

  const birthDateInput = document.getElementById("birthDate");
  const personalCodeInput = document.getElementById("personalCode");

  const allDataFields = document.querySelectorAll("[data-field]");

  allDataFields.forEach((el) => {
    const eventName =
      el.tagName === "SELECT" || el.type === "radio" ? "change" : "input";

    el.addEventListener(eventName, () => {
      updateClientDataFromField(el);
      updatePersonalCodeIfNeeded();
      validateMaritalStatusAge();
      updateVisibility();
      updateProgress();
      updatePreview();
    });
  });

  educationSelect.addEventListener("change", () => {
    if (educationSelect.value) {
      educationDetails.classList.remove("hidden");
    } else {
      educationDetails.classList.add("hidden");
    }
  });

  maritalStatusSelect.addEventListener("change", () => {
    if (maritalStatusSelect.value === "married") {
      spouseFields.classList.remove("hidden");
    } else {
      spouseFields.classList.add("hidden");
      clearNestedFields(spouseFields);
    }
    validateMaritalStatusAge();
  });

  professionalStatusSelect.addEventListener("change", () => {
    updateProfessionalBlocks();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const missing = findMissingRequiredFields();
    if (missing.length > 0) {
      alert(
        "Prašome užpildyti visus privalomus laukus:\n\n- " +
          missing.join("\n- ")
      );
      return;
    }

    alert("Anketa sėkmingai užpildyta! Duomenis matote peržiūros bloke.");
    console.log("Kliento duomenys:", clientData);
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    for (const key in clientData) {
      delete clientData[key];
    }
    educationDetails.classList.add("hidden");
    spouseFields.classList.add("hidden");
    studyFields.classList.add("hidden");
    workFields.classList.add("hidden");
    unemployedFields.classList.add("hidden");
    parentalLeaveFields.classList.add("hidden");
    maritalWarning.classList.add("hidden");
    maritalWarning.textContent = "";
    updateProgress();
    updatePreview();
  });

  updateProgress();
  updatePreview();

  function updateClientDataFromField(el) {
    const path = el.dataset.field;
    if (!path) return;

    if (el.type === "radio") {
      if (!el.checked) return;
    }

    const value = el.value;

    const parts = path.split(".");
    let current = clientData;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!current[p] || typeof current[p] !== "object") {
        current[p] = {};
      }
      current = current[p];
    }
    current[parts[parts.length - 1]] = value;
  }

  function updatePreview() {
    dataPreview.textContent =
      JSON.stringify(clientData, null, 2) ||
      "// Duomenys bus rodomi čia pildant anketą";
  }

  function updatePersonalCodeIfNeeded() {
    const gender = getClientGender();
    const birthDateStr = birthDateInput.value;

    if (!gender || !birthDateStr) return;

    const birthDate = new Date(birthDateStr);
    if (Number.isNaN(birthDate.getTime())) return;

    const year = birthDate.getFullYear();
    const yy = String(year).slice(-2);
    const mm = String(birthDate.getMonth() + 1).padStart(2, "0");
    const dd = String(birthDate.getDate()).padStart(2, "0");

    const firstDigit = getLtPersonalCodeFirstDigit(gender, year);
    if (!firstDigit) return;

    const firstSeven = `${firstDigit}${yy}${mm}${dd}`;
    const current = personalCodeInput.value || "";
    const suffix = current.length > 7 ? current.slice(7) : "";
    const newCode = (firstSeven + suffix).slice(0, 11);
    personalCodeInput.value = newCode;

    clientData.personalCode = newCode;
  }

  function getLtPersonalCodeFirstDigit(gender, year) {
    let century;
    if (year >= 1800 && year <= 1899) century = 1;
    else if (year >= 1900 && year <= 1999) century = 2;
    else if (year >= 2000 && year <= 2099) century = 3;
    else return null;

    switch (century) {
      case 1:
        return gender === "male" ? "1" : "2";
      case 2:
        return gender === "male" ? "3" : "4";
      case 3:
        return gender === "male" ? "5" : "6";
      default:
        return null;
    }
  }

  function getClientGender() {
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    for (const r of genderRadios) {
      if (r.checked) return r.value;
    }
    return null;
  }

  function calculateAge(dateStr) {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function validateMaritalStatusAge() {
    const status = maritalStatusSelect.value;
    const birthDateStr = birthDateInput.value;
    if (!status || !birthDateStr) {
      maritalWarning.classList.add("hidden");
      maritalWarning.textContent = "";
      return;
    }

    const age = calculateAge(birthDateStr);
    if (age === null) {
      maritalWarning.classList.add("hidden");
      maritalWarning.textContent = "";
      return;
    }

    if (status === "married") {
      if (age < 16) {
        maritalWarning.textContent =
          "Pagal nurodytą gimimo datą asmuo yra per jaunas santuokai (iki 16 m.).";
        maritalWarning.classList.remove("hidden");
      } else if (age < 18) {
        maritalWarning.textContent =
          "Dėmesio: santuokai nuo 16 iki 18 metų būtinas teismo leidimas (ribinis atvejis).";
        maritalWarning.classList.remove("hidden");
      } else {
        maritalWarning.classList.add("hidden");
        maritalWarning.textContent = "";
      }
    } else {
      maritalWarning.classList.add("hidden");
      maritalWarning.textContent = "";
    }
  }

  function updateProfessionalBlocks() {
    const value = professionalStatusSelect.value;

    studyFields.classList.add("hidden");
    workFields.classList.add("hidden");
    unemployedFields.classList.add("hidden");
    parentalLeaveFields.classList.add("hidden");

    if (value === "studijuoja") {
      studyFields.classList.remove("hidden");
    } else if (value === "dirba") {
      workFields.classList.remove("hidden");
    } else if (value === "nedirba") {
      unemployedFields.classList.remove("hidden");
    } else if (value === "atostogose") {
      parentalLeaveFields.classList.remove("hidden");
    }
  }

  function updateProgress() {
    const requiredFieldNames = [
      "gender",
      "firstName",
      "lastName",
      "birthDate",
      "personalCode",
      "phone",
      "email",
      "address",
      "education",
      "maritalStatus",
      "professionalStatus",
    ];

    let filled = 0;

    if (getClientGender()) filled++;

    requiredFieldNames.forEach((name) => {
      if (name === "gender") return;

      const el = document.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (el.value && el.value.trim() !== "") {
        filled++;
      }
    });

    if (!educationDetails.classList.contains("hidden")) {
      const lastInstitution = document
        .getElementById("lastInstitution")
        .value.trim();
      const graduationYear = document
        .getElementById("graduationYear")
        .value.trim();
      if (lastInstitution) filled++;
      if (graduationYear) filled++;
    }

    if (!spouseFields.classList.contains("hidden")) {
      const sf = document.getElementById("spouseFirstName").value.trim();
      const sl = document.getElementById("spouseLastName").value.trim();
      if (sf) filled++;
      if (sl) filled++;
    }

    if (!studyFields.classList.contains("hidden")) {
      const si = document.getElementById("studyInstitution").value.trim();
      if (si) filled++;
    }

    if (!workFields.classList.contains("hidden")) {
      const emp = document.getElementById("employer").value.trim();
      if (emp) filled++;
    }

    const totalPossible = 16;
    const ratio = Math.min(1, filled / totalPossible);
    const percent = Math.round(ratio * 100);

    progressBar.style.width = percent + "%";

    if (percent === 0) {
      statusText.textContent = "Nepradėta";
    } else if (percent < 100) {
      statusText.textContent = `Pildoma (${percent} %)`;
    } else {
      statusText.textContent = "Baigta (100 %)";
    }
  }

  function findMissingRequiredFields() {
    const missing = [];

    if (!getClientGender()) missing.push("Lytis");

    const mapping = [
      { name: "firstName", label: "Vardas" },
      { name: "lastName", label: "Pavardė" },
      { name: "birthDate", label: "Gimimo data" },
      { name: "personalCode", label: "Asmens kodas" },
      { name: "phone", label: "Telefono numeris" },
      { name: "email", label: "El. paštas" },
      { name: "address", label: "Gyvenamoji vieta" },
      { name: "education", label: "Išsilavinimas" },
      { name: "maritalStatus", label: "Vedybinė padėtis" },
      { name: "professionalStatus", label: "Profesinė padėtis" },
    ];

    mapping.forEach(({ name, label }) => {
      const el = document.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (!el.value || el.value.trim() === "") {
        missing.push(label);
      }
    });

    return missing;
  }

  function clearNestedFields(container) {
    const inputs = container.querySelectorAll("input, textarea, select");
    inputs.forEach((i) => {
      i.value = "";
    });
  }

  function updateVisibility() {}
});
