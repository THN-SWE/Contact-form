/*

This form is programmed, considering the user will probably fill up the form top to down. Because form chekcs for valid 
input in a top to bottom manner. Therefore the error messages only show up if you fill up top to bottom. 
I coded this way because it was easy (not really) for me to check for every input is valid and proceed to submit the form.
This is how I got into this pyramid of hell below.

 */

// importing almost all elements from my HTML document. This is how you write clean code :)

const contactBtn = document.getElementById("contact-us-btn");
const contactForm = document.getElementById("contact-us-form");
const form = document.querySelector("form");
const closeBtn = document.getElementById("form-close-btn");
const sendBtn = document.getElementById("send-btn");

// Regex patterns
const phoneRegex = /^\+94\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/;
const addressRegex = /^(?:\d+|\w+)(?:,\s*(?:\d+|\w+))+$/;

// input elements
const name_inp = document.getElementById("name");
const address_inp = document.getElementById("address");
const phone_inp = document.getElementById("phone");
const email_inp = document.getElementById("email");
const message_inp = document.getElementById("message");

// error message containers - span
const name_err = document.getElementById("name-error");
const address_err = document.getElementById("address-error");
const phone_err = document.getElementById("phone-error");
const email_err = document.getElementById("email-error");
const message_err = document.getElementById("message-error");

// to use variables declared inside css
let root_css = document.querySelector(":root");
let rs = getComputedStyle(root_css);

// to check form ready to submit
let isFormValid = false;

// adding event listeners to each elements NOTE: huge pain in the @$$, couldn't find any other solutions for my knowledge.

contactBtn.addEventListener("click", toggleContactForm);
closeBtn.addEventListener("click", toggleContactForm);

name_inp.addEventListener("input", () => {
  if (isValidInput(name_inp, nameRegex)) {
    changeValidInputColor(name_inp, true);
    closeErrorMessage(name_err);
    address_inp.addEventListener("input", () => {
      if (isValidInput(address_inp, addressRegex)) {
        changeValidInputColor(address_inp, true);
        closeErrorMessage(address_err);
        phone_inp.addEventListener("input", () => {
          if (isValidInput(phone_inp, phoneRegex)) {
            changeValidInputColor(phone_inp, true);
            closeErrorMessage(phone_err);
            email_inp.addEventListener("input", () => {
              if (isValidInput(email_inp, emailRegex)) {
                changeValidInputColor(email_inp, true);
                closeErrorMessage(email_err);
                message_inp.addEventListener("input", min_message_length);
              } else {
                changeValidInputColor(email_inp, false);
                displayErrorMessage(email_err);
              }
            });
          } else {
            changeValidInputColor(phone_inp, false);
            displayErrorMessage(phone_err);
          }
        });
      } else {
        changeValidInputColor(address_inp, false);
        displayErrorMessage(address_err);
      }
    });
  } else {
    changeValidInputColor(name_inp, false);
    displayErrorMessage(name_err);
  }
});

// display form and close function
function toggleContactForm() {
  contactForm.classList.toggle("hidden");
  contactBtn.classList.toggle("hidden");
}

// returns whether a input is valid or not
function isValidInput(input, regex) {
  return regex.test(input.value);
}

// return true if message has enough characters (min 10)
function min_message_length() {
  if (message_inp.value.length >= 10) {
    changeValidInputColor(message_inp, true);
    closeErrorMessage(message_err);
    isFormValid = true; // declaring a valid form.
  } else {
    changeValidInputColor(message_inp, false);
    displayErrorMessage(message_err);
    isFormValid = false;
  }
}

// change color according to valid and invalid input
function changeValidInputColor(input, isvalid) {
  if (isvalid) {
    input.style.color = rs.getPropertyValue("--neon-green");
  } else {
    input.style.color = rs.getPropertyValue("--neon-yellow");
  }
}

// functions for display and close error msgs
function displayErrorMessage(err_msg) {
  err_msg.style.display = "block";
}

function closeErrorMessage(err_msg) {
  err_msg.style.display = "none";
}

// a class for creating user data object to store inside localStorage
class UserData {
  constructor(name, address, phone, email, message) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.message = message;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission

  if (isFormValid) {
    // creating new from data object - so we can get the values of form fields by their  given 'name' property.
    const formData = new FormData(form);

    let user_data = new UserData(
      formData.get("name"),
      formData.get("address"),
      formData.get("phone"),
      formData.get("email"),
      formData.get("message")
    );

    // Store the form data in localStorage
    localStorage.setItem(
      JSON.stringify(formData.get("name")), // Name as key 
      JSON.stringify(user_data)             
    );

    form.submit(); // finally submiting the form.
    alert('successfully sent!'); 
    toggleContactForm();

  }
});
