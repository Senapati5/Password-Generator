const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initial values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() { //reflects pass length to ui
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

//indicator styling
function setIndicator(color) {
    // console.log(color)   #ccc
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //floor - round off
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
    return String.fromCharCode(getRndInteger(97,123)) //number to string from ascii code
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length); //from symbols string
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); //green
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0"); //yellow
    } else {
        setIndicator("#f00"); //red
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) { //array shuffle
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) { //backward loop
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {
        // console.log(str); //each element of array adding to string
        (str = str + el)
    });
    // console.log(str)
    return str; 
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        // console.log(allCheckBox); //nodeList
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => { //when the check box state changes
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => { //on slider change
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    // console.log("Starting the Journey");
    //remove old password
    password = "";

    let funcArr = [];

    //one time push

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password = password + funcArr[i]();
    }
    // console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        // console.log("randIndex" + randIndex);
        // console.log(password)
        password = password + funcArr[randIndex]();
    }
    // console.log("Remaining adddition done");

    //shuffle the password
    password = shufflePassword(Array.from(password)); //here the string is returned to password
    // console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    // console.log("UI adddition done");

    //calculate strength
    calcStrength();
});