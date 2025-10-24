const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn, .btn1, .btn2");


let firstNumber = "";
let operator = "";
let secondNumber = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.id;

    if (!isNaN(value) || value === ".") {
      if (operator === "") {
        firstNumber += value;
        display.value = firstNumber;
      } else {
        secondNumber += value;
        display.value = secondNumber;
      }
    } 

    else if (["+", "-", "*", "/", "^"].includes(value)) {
      operator = value;
    } 

    else if (value === "^2") {
      if (firstNumber !== "") {
        const num = parseFloat(firstNumber);
        const result = num * num;
        display.value = result;
        firstNumber = result.toString();
        secondNumber = "";
        operator = "";
      }
    }

    else if (value === "sqrt") {
      if (firstNumber !== "") {
        const num = parseFloat(firstNumber);
        if (num < 0) {
          display.value = "Klaida";
        } else {
          const result = Math.sqrt(num);
          display.value = result;
          firstNumber = result.toString();
          secondNumber = "";
          operator = "";
        }
      }
    }

    else if (value === "equals") {
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      let result;

      if (operator === "+") {
        result = num1 + num2;
      } 
      else if (operator === "-") {
        result = num1 - num2;
      } 
      else if (operator === "*") {
        result = num1 * num2;
      } 
      else if (operator === "/") {
        if (num2 === 0) {
          result = "Klaida";
        } else {
          result = num1 / num2;
        }
      }
      else if (operator === "^") {
        result = Math.pow(num1, num2);
      }

      display.value = result;
      firstNumber = result.toString();
      secondNumber = "";
      operator = "";
    } 

    else if (value === "C") {
      firstNumber = "";
      secondNumber = "";
      operator = "";
      display.value = "0";
    }
  });
});
