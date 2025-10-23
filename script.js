const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let firstNumber = "";
let operator = "";
let secondNumber = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.id;

    if (!isNaN(value) || value === ".") {
      // Skaičiai ir taškas
      if (operator === "") {
        firstNumber += value;
        display.value = firstNumber;
      } else {
        secondNumber += value;
        display.value = secondNumber;
      }
    } 
    else if (["+", "-", "*", "/"].includes(value)) {
      // Operatorius
      operator = value;
    } 
    else if (value === "equals") {
      // Skaičiavimas
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      let result;

      if (operator === "+") result = num1 + num2;
      else if (operator === "-") result = num1 - num2;
      else if (operator === "*") result = num1 * num2;
      else if (operator === "/") {
        if (num2 === 0) {
          result = "Klaida";
        } else {
          result = num1 / num2;
        }
      }

      display.value = result;
      firstNumber = result.toString();
      secondNumber = "";
      operator = "";
    } 
    else if (value === "C") {
      // Išvalyti
      firstNumber = "";
      secondNumber = "";
      operator = "";
      display.value = "";
    }
  });
});
