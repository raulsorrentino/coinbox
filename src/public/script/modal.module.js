var loginModal = document.getElementById('loginModal');
var createAccountModal = document.getElementById('createAccountModal');
var loginInput = document.getElementById('InputEmailLogin');
var createAccountInput = document.getElementById('InputNamecreateAccount');

loginModal.addEventListener('shown.bs.modal', function() {
    loginInput.focus();
});

createAccountModal.addEventListener('shown.bs.modal', function() {
    createAccountInput.focus();
});