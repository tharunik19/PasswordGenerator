const passwordDisplay = document.querySelector(".password");
const lengthDisplay = document.querySelector(".length span");
const lengthInput = document.getElementById("password-length");
const numberCheckbox = document.getElementById("setting-number");
const specialCharCheckbox = document.getElementById("setting-specialchar");
const generateButton = document.getElementById("password-generator");
const saveButton = document.getElementById("save-password");
const passwordList = document.getElementById("password-list");

const startCharInput = document.getElementById("start-char");
const endCharInput = document.getElementById("end-char");
const includeCharsInput = document.getElementById("include-chars");
const excludeCharsInput = document.getElementById("exclude-chars");

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const specialChars = "!@#$%^&*()_+{}[]<>?/|";

lengthInput.addEventListener("input", () => {
    lengthDisplay.textContent = lengthInput.value;
});

function generatePassword() {
    let availableChars = letters;
    if (numberCheckbox.checked) availableChars += numbers;
    if (specialCharCheckbox.checked) availableChars += specialChars;

    let mustInclude = includeCharsInput.value.split("").filter(char => char.trim() !== "");
    let excludeChars = excludeCharsInput.value.split("").filter(char => char.trim() !== "");

    availableChars = availableChars.split("").filter(char => !excludeChars.includes(char)).join("");

    // Ensure mustInclude characters are always available
    for (let char of mustInclude) {
        if (!availableChars.includes(char)) {
            availableChars += char;
        }
    }

    if (availableChars.length === 0) {
        passwordDisplay.textContent = "Error: No characters left to use!";
        return;
    }

    let password = [];

    // Ensure "must include" characters are added first (without exceeding length)
    for (let char of mustInclude) {
        if (password.length < lengthInput.value) {
            password.push(char);
        }
    }

    // Fill remaining slots with random characters
    while (password.length < lengthInput.value) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password.push(availableChars[randomIndex]);
    }

    // Shuffle password to distribute "must include" characters
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    password = password.join("");

    // Apply start and end characters if provided
    if (startCharInput.value) {
        password = startCharInput.value + password.slice(startCharInput.value.length);
    }
    if (endCharInput.value) {
        password = password.slice(0, -endCharInput.value.length) + endCharInput.value;
    }

    // Ensure the final password length matches the selected length
    password = password.substring(0, lengthInput.value);
    passwordDisplay.textContent = password;
}

generateButton.addEventListener("click", generatePassword);

saveButton.addEventListener("click", () => {
    const password = passwordDisplay.textContent;
    if (password) {
        const li = document.createElement("li");
        li.textContent = password;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => li.remove());

        li.appendChild(deleteButton);
        passwordList.appendChild(li);
    }
});

generatePassword();