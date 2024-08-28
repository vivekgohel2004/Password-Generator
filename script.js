const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const inputSlider = document.querySelector('[data-lengthSlider]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const allCheckbox = document.querySelectorAll('input[type=checkbox]');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('[data-btn]');
const symbols = "@#$";


let password = "";
let passwordLength = 10;
let checkboxCount = 0;

sliderHandle();
function sliderHandle() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    inputSlider.style.backgroundSize = (passwordLength * 5) + "%"; // to fill background colour till value / thumb
}

function getRandomInteger(min, max) {
    var x = Math.floor(Math.random() * (max - min) + min); // to get random between min and max
    console.log(x);
    return x;
}

function generateNumber() {
    return getRandomInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123)); // Generates character from ASCII value
    
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));   // Generates character from ASCII value 
}

function generateSymbol() {
    const rndNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0.1px 0.1px 1rem " + color;
}

function calculateStrength() {

    let uc = true;
    (uppercaseCheck.checked) ? uc = true : uc = false;

    let lc = true;
    (lowercaseCheck.checked) ? lc = true : lc = false;

    let num = true;
    (numbersCheck.checked) ? num = true : num = false;

    let symb = true;
    (symbolsCheck.checked) ? symb = true : symb = false;


    // Green: Strong password
    if (uc && lc && (num || symb) && passwordLength > 7) {
        setIndicator("lime");
    }


    // Yellow: Fair password 
    else if ((uc || lc) && (num || symb) && passwordLength > 5) {
        setIndicator("yellow");
    }
    
    // Red: Weak password 
    else if (passwordLength > 0) {
        setIndicator("red");
    }

    // default
    else {
        setIndicator("grey");
    }
}

inputSlider.addEventListener('input', () => {
    passwordLength = inputSlider.value;
    sliderHandle();
});

// to use await, it must be in async function 
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);

}

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange() {
    checkboxCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkboxCount++;
        }
    })

    // corner case 
    if (passwordLength < checkboxCount) {
        passwordLength = checkboxCount;
        sliderHandle();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(password) {

    for (let i = password.length; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];    // swapping 
    }

    return password;

}

generateBtn.addEventListener('click', () => {
    if (checkboxCount == 0) {
        return;
    }

    if (passwordLength < checkboxCount) {
        passwordLength = checkboxCount;
        sliderHandle();
    }

    // removing old password if any to generate new password
    password = "";


    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase); // Storing the function, not the result
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase); // Storing the function, not the result
    }

    if (numbersCheck.checked) {
        funcArr.push(generateNumber); // Storing the function, not the result
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol); // Storing the function, not the result
    }

    if (passwordLength < checkboxCount) {
        passwordLength = checkboxCount;
        sliderHandle();
    }

    // compulsory addition => atleast one of eack checked box 
    for (let index = 0; index < funcArr.length; index++) {
        password += funcArr[index](); // Calls generateUpperCase(), returns a new character, e.g., "A"
    }

    // remaining addition => password length - funcArr = only checked are added 
    for (let index = 0; index < passwordLength - funcArr.length; index++) {
        let randomdIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomdIndex]();
    }

    password = shufflePassword(Array.from(password));   // converts the string into an array of characters.

    // The join() method in JavaScript is used to combine all elements of an array into a single string.
    password = password.join("");

    passwordDisplay.value = password;

    calculateStrength();

})