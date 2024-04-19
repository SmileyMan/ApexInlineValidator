# ApexInlineValidator
Inline validation of inputs using just the attribute data-validate

## Installation
Load JavaScript file from APP_FILES

## Usage
Add a data-validate="" attribute to the input (Advanced -> Custom Attributes)\
For options and syntax see: https://github.com/icebob/fastest-validator#shorthand-definitions

## Screenshot
![Screenshot](assets/example.PNG)

## Check validation before submit
Target submit button to a dynamic action with the JS below

```js
const isValidated = apexInlineValidator.checkValidation();
if (isValidated) {
  apex.submit("SUBMIT");
} else {
  apex.message.alert( "Please correct and re-submit", () => {}, {
      title: "Form has failed validation",
      style: "warning",
      iconClasses: "fa fa-warning fa-2x",
      okLabel: "OK"
  });
}
```
