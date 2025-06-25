/*
(function (doc) {
  const masks = {
    phone(digitsOnly) {
      // (00) 00000-0000 | (00) 0000-0000
      return String(digitsOnly)
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
        .replace(/(-\d{4})(\d)+?$/, "$1");
    },
    landline(digitsOnly) {
      // (00) 0000-0000
      return String(digitsOnly)
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{4})(\d)$/, "$1");
    },
    cep(digitsOnly) {
      // 00000-000
      return String(digitsOnly)
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})(\d)$/, "$1");
    },
    cpf(digitsOnly) {
      // 000.000.000-00
      return String(digitsOnly)
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})(\d)$/, "$1");
    },
    cnpj(digitsOnly) {
      // 00.000.000/0000-00
      return String(digitsOnly)
        .replace(/\D/g, "")
        .replace(/(\d\d)(\d)/, "$1.$2")
        .replace(/(\d\d\d)(\d)/, "$1.$2")
        .replace(/(\d\d\d)(\d)/, "$1/$2")
        .replace(/(\d\d\d\d)(\d)/, "$1-$2")
        .replace(/(-\d\d)(\d)$/, "$1");
    },
  };
  const selectedMasks = doc.querySelectorAll("[data-mask]");

  selectedMasks.forEach(function ($input) {
    let maskType = $input.dataset.mask;
    $input.addEventListener("input", function (event) {
      event.target.value = masks[maskType](event.target.value);
    });
  });
})(document);
*/

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const apiUrl = `https://naturally-apt-terrapin.ngrok-free.app/api/send-email`;
  const formElements = document.querySelectorAll(".before-element");
  const successAlertElement = document.querySelector(".success-alert");
  const active = `active`,
    dangerAlert = `danger-alert`;

  // createRequestBody(this, "multipart/form-data", apiUrl);
  createRequestBody(this, "application/json", apiUrl);

  function createRequestBody(formElement, contentType, apiUrl) {
    switch (contentType) {
      case "multipart/form-data":
        const formData = new FormData(formElement);

        for (let [key, value] of Array.from(formData.entries())) {
          if ((key && !value) || value.trim() === "") {
            formData.delete(key);
            continue;
          }

          switch (key) {
            case "phone":
            case "landline":
            case "cep":
            case "cpf":
            case "cnpj":
              formData.set(key, sanitizeInput(value));
              break;
          }
        }

        sendRequest(undefined, formData, apiUrl);
        break;
      case "application/json":
        const data = {
          name: formElement.name.value,
          email: formElement.email.value,
          ...(formElement.phone?.value && {
            phone: sanitizeInput(formElement.phone.value),
          }),
          ...(formElement.landline?.value && {
            landline: sanitizeInput(formElement.landline.value),
          }),
          ...(formElement.cep?.value && {
            cep: sanitizeInput(formElement.cep.value),
          }),
          ...(formElement.cpf?.value && {
            cpf: sanitizeInput(formElement.cpf.value),
          }),
          ...(formElement.cnpj?.value && {
            cnpj: sanitizeInput(formElement.cnpj.value),
          }),
          ...(formElement.subject?.value && {
            subject: formElement.subject.value,
          }),
          message: formElement.message.value,
        };
        sendRequest(
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
          data,
          apiUrl
        );
        break;
    }
  }

  function sendRequest(...args) {
    const [requestInitHeaders, data, apiUrl] = args;
    const contentType = requestInitHeaders?.headers["Content-Type"] || "";
    const requestBody = contentType.startsWith("application/json")
      ? JSON.stringify(data)
      : data;

    fetch(apiUrl, {
      method: "POST",
      ...requestInitHeaders,
      body: requestBody,
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw text;
          });
        }

        return response.json();
      })
      .then((response) => {
        responseAlert(successAlertElement, response, undefined);
      })
      .catch((error) => {
        responseAlert(
          successAlertElement,
          undefined,
          error && JSON?.parse(error)
        );
      });
  }

  function sanitizeInput(value) {
    return String(value).replace(/\D/g, "");
  }

  function responseAlert(
    successAlertElement,
    response = undefined,
    error = undefined
  ) {
    if (response?.success) {
      successAlertElement.classList.add(active);
      successAlertElement.textContent = `${String(response.message).replace(
        "!",
        "..."
      )}`;

      removeClass(successAlertElement, active);
    } else {
      renderValidationMessages(error, dangerAlert);
      removeClass(successAlertElement, dangerAlert);
    }
  }

  function removeClass(successAlertElement, alertType) {
    if (successAlertElement.classList.contains(alertType)) {
      setTimeout(() => {
        successAlertElement.classList.remove(alertType);
        successAlertElement.textContent = "";
        formElements.forEach((target) => (target.value = ""));
      }, 4000);
    }
  }

  function renderValidationMessages(error) {
    if (error && Object.keys(error).length > 0) {
      if (error.hasOwnProperty("errors")) {
        const _errors = Array.from(Object.entries(error["errors"]));
        for (const [key, error] of _errors) {
          switch (key) {
            case "name":
            case "email":
            case "message":
              showFieldError(error, key);
              break;
          }
        }
      }
    }
  }

  function showFieldError(error, key) {
    const span = document.createElement("span");
    span.setAttribute("class", dangerAlert);
    span.textContent = error;

    Array.from(formElements).find((target) =>
      target.name === key ? target.after(span) : undefined
    );

    if (span) setTimeout(() => span.remove(), 4000);
  }
});
