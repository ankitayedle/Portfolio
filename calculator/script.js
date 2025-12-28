const display = document.getElementById("display");
const mirror = document.getElementById("mirror");

function append(value) {
  display.value += value;
  mirror.innerText = display.value;
}

function clearDisplay() {
  display.value = "";
  mirror.innerText = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
  mirror.innerText = display.value;
}

function calculate() {
  try {
    display.value = eval(display.value);
    mirror.innerText = display.value;
  } catch {
    display.value = "Error";
  }
}

/* Scientific */
function sin() { display.value = Math.sin(toRad(display.value)); }
function cos() { display.value = Math.cos(toRad(display.value)); }
function tan() { display.value = Math.tan(toRad(display.value)); }
function sqrt() { display.value = Math.sqrt(display.value); }
function square() { display.value = Math.pow(display.value, 2); }
function cube() { display.value = Math.pow(display.value, 3); }

function toRad(val) {
  return val * Math.PI / 180;
}

/* Theme Toggle */
function toggleTheme() {
  document.body.classList.toggle("light");
}
