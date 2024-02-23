document.addEventListener("DOMContentLoaded", function () {
  let percent = 0;
  const loadingPercentElement = document.getElementById("loading-percent");
  const spinnerElement = document.querySelector(".spinner");

  function updateLoadingPercent() {
      loadingPercentElement.textContent = percent + "%";
      spinnerElement.style.transform = `rotate(${percent * 3.6}deg)`; // Hace que la ruedita gire
  }

  function incrementPercent() {
      percent++;
      updateLoadingPercent();

      if (percent < 100) {
          setTimeout(incrementPercent, 50); // Incrementa el porcentaje cada 50 ms
      } else {
          // Redirige a la siguiente página cuando llega al 100%
          window.location.href = "home.html";
      }
  }

  // Inicia la animación del porcentaje
  incrementPercent();
});


//======================formulario===============================//

    document.getElementById("submitButton").addEventListener("click", function () {
        const requiredInputs = document.querySelectorAll("input[required]");
        let allInputsValid = true;

        requiredInputs.forEach((input) => {
            if (input.value.trim() === "") {
                allInputsValid = false;
            }
        });

        if (allInputsValid) {
            document.getElementById("overlay").style.display = "block";
            const messageContainer = document.getElementById("messageContainer");
            const okHandImage = document.getElementById("okHandImage");
            messageContainer.textContent = "Excelente!!!";
           

            // Animación del mensaje de registro exitoso y de la imagen
            messageContainer.style.opacity = "0";
            okHandImage.style.opacity = "0";
            messageContainer.style.transition = "opacity 0.5s ease-in-out";
            okHandImage.style.transition = "opacity 0.5s ease-in-out";
            setTimeout(function () {
                messageContainer.style.opacity = "1";
                okHandImage.style.opacity = "1";
            }, 100);

            // Redireccionar al usuario después de un breve retraso (por ejemplo, 2 segundos)
            setTimeout(function () {
                window.location.href = "loading.html";
            }, 2000); // 2000 milisegundos = 2 segundos
        } else {
            alert("Por favor, complete todos los campos obligatorios.");
        }
    });

















