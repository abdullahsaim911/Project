(function () {
  'use strict'

  var forms = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  
  const termsCheckbox = document.getElementById('termsCheckbox');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  termsCheckbox.addEventListener('change', function() {
    if (this.checked) {
      placeOrderBtn.disabled = false;
    } else {
      placeOrderBtn.disabled = true;
    }
  });

})();