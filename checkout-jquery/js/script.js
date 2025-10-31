$(document).ready(function() {

    function validateField(field, validationRule) {
        const isValid = validationRule(field.val());
        if (isValid) {
            field.removeClass('is-invalid').addClass('is-valid');
        } else {
            field.removeClass('is-valid').addClass('is-invalid');
        }
        return isValid;
    }

    const validations = {
        fullName: val => val.trim().length >= 3,
        email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        phone: val => /^\d{10,}$/.test(val.replace(/\D/g, '')),
        address: val => val.trim().length > 0,
        city: val => val.trim().length > 0,
        postalCode: val => /^\d{4,6}$/.test(val.trim()),
        country: val => val !== "",
        cardholder: val => val.trim().length > 0,
        cardNumber: val => /^\d{13,16}$/.test(val.replace(/\s/g, '')),
        expiry: val => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val.trim()),
        cvv: val => /^\d{3,4}$/.test(val.trim())
    };

    $('#fullName').on('input', () => validateField($('#fullName'), validations.fullName));

    $('#email').on('input', () => validateField($('#email'), validations.email));
    
    $('#phone').on('input', () => validateField($('#phone'), validations.phone));
    
    $('#address').on('input', () => validateField($('#address'), validations.address));
    
    $('#city').on('input', () => validateField($('#city'), validations.city));
    
    $('#postalCode').on('input', () => validateField($('#postalCode'), validations.postalCode));
    
    $('#country').on('change', () => validateField($('#country'), validations.country));
    
    $('#cardholder').on('input', () => validateField($('#cardholder'), validations.cardholder));
    
    $('#cardNumber').on('input', () => validateField($('#cardNumber'), validations.cardNumber));
    
    
    $('#expiry').on('input', () => validateField($('#expiry'), validations.expiry));
    
    $('#cvv').on('input', () => validateField($('#cvv'), validations.cvv));
    
    const creditCardFields = $('#creditCardFields');
    creditCardFields.hide();

    $('input[name="paymentMethod"]').on('change', function() {
        $('.payment-methods .invalid-feedback').hide();

        if ($(this).val() === 'creditCard') {
            creditCardFields.slideDown();
            $('#cardholder, #cardNumber, #expiry, #cvv').prop('required', true);
        } else {
            creditCardFields.slideUp();
            $('#cardholder, #cardNumber, #expiry, #cvv').prop('required', false);
            creditCardFields.find('.form-control').removeClass('is-invalid is-valid');
        }
    });

    $('#checkoutForm').on('submit', function(event) {
        event.preventDefault();
        
        let isFormValid = true;

        isFormValid &= validateField($('#fullName'), validations.fullName);
        isFormValid &= validateField($('#email'), validations.email);
        isFormValid &= validateField($('#phone'), validations.phone);
        isFormValid &= validateField($('#address'), validations.address);
        isFormValid &= validateField($('#city'), validations.city);
        isFormValid &= validateField($('#postalCode'), validations.postalCode);
        isFormValid &= validateField($('#country'), validations.country);

        const paymentMethodSelected = $('input[name="paymentMethod"]:checked').length > 0;
        if (!paymentMethodSelected) {
            $('.payment-methods .invalid-feedback').show();
            isFormValid = false;
        } else {
            $('.payment-methods .invalid-feedback').hide();
        }

        if ($('input[name="paymentMethod"]:checked').val() === 'creditCard') {
            isFormValid &= validateField($('#cardholder'), validations.cardholder);
            isFormValid &= validateField($('#cardNumber'), validations.cardNumber);
            isFormValid &= validateField($('#expiry'), validations.expiry);
            isFormValid &= validateField($('#cvv'), validations.cvv);
        }

        const termsCheckbox = $('#termsCheckbox');
        if (!termsCheckbox.is(':checked')) {
            termsCheckbox.addClass('is-invalid');
            termsCheckbox.next().next('.invalid-feedback').show();
            isFormValid = false;
        } else {
            termsCheckbox.removeClass('is-invalid');
            termsCheckbox.next().next('.invalid-feedback').hide();
        }
        
        termsCheckbox.on('change', function() {
            if ($(this).is(':checked')) {
                $(this).removeClass('is-invalid');
                $(this).next().next('.invalid-feedback').hide();
            }
        });

        if (isFormValid) {
            alert('Form submitted successfully!');
        } else {
            const firstError = $('.is-invalid').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 100
                }, 500);
            }
        }
    });
});