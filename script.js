const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn, .btn1, .btn2");

let firstNumber = "";
let operator = "";
let secondNumber = "";
let justCalculated = false;

display.value = "0";

function handleInput(value) {
  if (!isNaN(value) || value === ".") {
    if (justCalculated) {
      firstNumber = "";
      justCalculated = false;
    }

    if (operator === "") {
      firstNumber += value;
      display.value = firstNumber;
    } else {
      secondNumber += value;
      display.value = firstNumber + " " + operator + " " + secondNumber;
    }
  }

  else if (["+", "-", "*", "/", "^"].includes(value)) {
    if (firstNumber !== "") {
      if (operator !== "" && secondNumber !== "") {
        handleInput("equals");
      }
      operator = value;
      justCalculated = false;
      display.value = firstNumber + " " + operator;
    }
  }

  else if (value === "^2") {
    if (firstNumber !== "") {
      const num = parseFloat(firstNumber);
      const result = num * num;
      display.value = result;
      firstNumber = result.toString();
      secondNumber = "";
      operator = "";
      justCalculated = true;
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
        justCalculated = true;
      }
    }
  }

  else if (value === "equals" || value === "=") {
    if (firstNumber !== "" && operator !== "" && secondNumber !== "") {
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      let result;

      if (operator === "+") {
        result = num1 + num2;
      } else if (operator === "-") {
        result = num1 - num2;
      } else if (operator === "*") {
        result = num1 * num2;
      } else if (operator === "/") {
        result = num2 === 0 ? "Klaida" : num1 / num2;
      } else if (operator === "^") {
        result = Math.pow(num1, num2);
      }

      display.value = result;
      firstNumber = result.toString();
      secondNumber = "";
      operator = "";
      justCalculated = true;
    }
  }

  else if (value === "C") {
    firstNumber = "";
    secondNumber = "";
    operator = "";
    display.value = "0";
    justCalculated = false;
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => handleInput(button.id));
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || key === ".") {
    handleInput(key);
  } 
  else if (["+", "-", "*", "/", "^"].includes(key)) {
    handleInput(key);
  } 
  else if (key === "Enter" || key === "=") {
    handleInput("equals");
  } 
  else if (key === "c" || key === "C" || key === "Escape") {
    handleInput("C");
  } 
  else if (key === "Backspace") {
    if (operator === "") {
      firstNumber = firstNumber.slice(0, -1);
      display.value = firstNumber || "0";
    } else {
      secondNumber = secondNumber.slice(0, -1);
      display.value = firstNumber + " " + operator + " " + (secondNumber || "");
    }
  }
  else if (key === "s" || key === "S") {
    handleInput("sqrt");
  }
  else if (key === "q" || key === "Q") {
    handleInput("^2");
  }
});
