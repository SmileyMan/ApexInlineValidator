/*!
 * ApexInlineValidator
 * Validation of Oracle Apex inputs using just the attribute tag data-validate
 * Uses the fastest-validator library: https://github.com/icebob/fastest-validator
 * Follow the shorthand syntax: https://github.com/icebob/fastest-validator#shorthand-definitions
 *
 * @version v1.0
 * @author SmileyMan (Steve Miles)
 * @github https://github.com/SmileyMan/ApexInlineValidator
 * @license MIT
 */

// Namespace
const apexInlineValidator = {
  // Library location
  _fastestValidatorLibUrl: "https://unpkg.com/fastest-validator",
  // Events to bind too
  _events: ["blur", "input", "change", "pointerout", "paste"],
  // Storage arrays for validation objects and values
  _validatorArr: [],
  _validateCheckArr: [],
  _notValidatedArr: [],
  /*
    Public: Loads library and calls inlineValidatePrepare
  */
  inlineValidateSetup: function() {
    const script = document.createElement("script")
    script.type = "text/javascript";
    script.onload = () => {
      apexInlineValidator._inlineValidatePrepare();
    };
    script.onerror = () => {
      console.error("Failed to load fastest-validator library.");
    };
    script.src = this._fastestValidatorLibUrl;
    document.getElementsByTagName("head")[0].appendChild(script);
  },
  /*
    Creates validation objects and attaches to item's events
    Does pe-validation for preset values
  */
  _inlineValidatePrepare: function() {
    document.querySelectorAll("[data-validate]").forEach(el => {
      if (el.dataset.validate !== "") {
        const currentIndex = this._validatorArr.length;
        this._validatorArr[currentIndex] = new FastestValidator();
        const schema = {
          validate: el.dataset.validate
        }

        this._validateCheckArr[currentIndex] = this._validatorArr[currentIndex].compile(schema);
        this._notValidatedArr[currentIndex] = 1;
        this._attachEventListeners(currentIndex, el);
        this._inlineValidate(currentIndex, el.id, el.value);
      }
    });
  },
  /*
    Attaches listeners to items
  */
  _attachEventListeners: function(index, el) {
    this._events.forEach(event => {
      el.addEventListener(event, (_event) => {
        this._inlineValidate(index, el.id, el.value);
      });
    });
  },
  /*
    Called to do validation
  */
  _inlineValidate: function(index, id, value) {
    const labelText = document.getElementById(id + "_LABEL").textContent.trim();
    const errorPlaceHolderElement = document.getElementById(id + "_error_placeholder");

    if (!labelText || !errorPlaceHolderElement) {
      console.error("Missing label or error placeholder element for ID:", id);
      return;
    }

    const valcheck = this._validateCheckArr[index]({
      validate: value
    });

    if (typeof valcheck === "boolean") {
      errorPlaceHolderElement.innerText = "";
      this._notValidatedArr[index] = 0;
    } else if (typeof valcheck === "object") {
      let errorMsg = valcheck[0].message;
      errorMsg = errorMsg.replace("validate", labelText);
      errorPlaceHolderElement.innerText = errorMsg;
      this._notValidatedArr[index] = 1;
    } else {
      errorPlaceHolderElement.innerText = "";
      this._notValidatedArr[index] = 0;
    }
  },
  /*
    Public: Returns true if all validations have passed
  */
  checkValidation: function() {
    const validationSum = this._notValidatedArr.reduce((partialSum, a) => partialSum + a, 0);
    return validationSum === 0;
  }
}
/*
  Enable valdation after page load
*/
window.onload = () => {
  apexInlineValidator.inlineValidateSetup();
}
