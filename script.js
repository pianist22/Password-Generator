const inputSlider = document.querySelector('[data-lengthSilder]');
const lengthDisplay = document.querySelector("[password-lengthNum]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMessage]");
const uppercaseCheck = document.querySelector("#upper-case");
const lowercaseCheck = document.querySelector("#lower-case");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbol");
const indicator = document.querySelector("[strength-indicator]");
const generateBtn = document.querySelector(".generatePassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// Set the strength selector color to grey
setIndicator("#ccc");

handleSlider();

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


// Generating Random Integer
function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min; // Generate Random Integer between min and max
}

function getRandomNumber(){
    return getRandomInteger(0,9); //Generates a random integer between 0 and 9
}

function getRandomLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function getRandomUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function randomSymbol(){
    const randInt = getRandomInteger(0,symbols.length);
    return symbols.charAt(randInt);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    // To make copy wala text visible 
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    // Special Condition 
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    // If none of the checkbox are checked 
    if(checkCount==0) return;
    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("Starting the journey for creating the passord");
    // lets start the  journey to find the new password
    // remove old password
    password = "";
    
    // lets put the stuff by checkboxes
    // if(uppercaseCheck.checked){
    //     password += getRandomUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += getRandomLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += getRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += randomSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked) 
        funcArr.push(getRandomUpperCase);
    if(lowercaseCheck.checked) 
        funcArr.push(getRandomLowerCase);
    if(numberCheck.checked) 
        funcArr.push(getRandomNumber);
    if(symbolsCheck.checked) 
        funcArr.push(randomSymbol);

    // Compulsory Addition
    console.log("Compulsory Addition Done");
    for(let i=0;i<funcArr.length;i++){
        console.log("Compulsion"+i);
        password += funcArr[i]();
    }

    // Remaining addition randomly
    console.log("Remaining additon is Done");
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndx = getRandomInteger(0,funcArr.length);
        console.log("randIndx"+randIndx);
        password += funcArr[randIndx]();
    }
    
    // Shuffle password
    console.log("Shuffling Done");
    password = shufflePassword(Array.from(password));

    // Displaying the password on the password display
    // display it on UI
    console.log("UI Addition is done");
    passwordDisplay.value = password;

    // Calculate the strength
    console.log("Calculating the strength");
    calcStrength();

})