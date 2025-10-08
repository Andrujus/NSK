document.getElementById("7").addEventListener("click", function() {
    document.getElementById("display").value += "7";
    var a = 7;
    return a;
});
document.getElementById("8").addEventListener("click", function() {
    document.getElementById("display").value += "8";
    a = 8;
}
);
document.getElementById("9").addEventListener("click", function() {
    document.getElementById("display").value += "9";
    a = 9;
});
document.getElementById("4").addEventListener("click", function() {
    document.getElementById("display").value += "4";
    a = 4;
});
document.getElementById("5").addEventListener("click", function() {
    document.getElementById("display").value += "5";
    a = 5;
});
document.getElementById("6").addEventListener("click", function() {
    document.getElementById("display").value += "6";
    a = 6;
});
document.getElementById("1").addEventListener("click", function() {
    document.getElementById("display").value += "1";
    a = 1;
});
document.getElementById("2").addEventListener("click", function() {
    document.getElementById("display").value += "2";
    a = 2;
});
document.getElementById("3").addEventListener("click", function() {
    document.getElementById("display").value += "3";
     a = 3;
});
document.getElementById("0").addEventListener("click", function() {
    document.getElementById("display").value += "0";
    a = 0;
});
document.getElementById("/").addEventListener("click", function() {
    document.getElementById("display").value += "/";
});
document.getElementById("*").addEventListener("click", function() {
    document.getElementById("display").value += "*";
});
document.getElementById("-").addEventListener("click", function() {
    document.getElementById("display").value += "-";
});
document.getElementById("+").addEventListener("click", function() {
    document.getElementById("display").value = "";
});
document.getElementById(".").addEventListener("click", function() {
    document.getElementById("display").value += ".";
});
document.getElementById("C").addEventListener("click", function() {
    document.getElementById("display").value = "";
});

document.getElementById("=").addEventListener("click", sum(a));

function sum(a) {
        document.getElementById("display").value = a + display.value;
};