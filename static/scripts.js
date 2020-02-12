$(document).ready( function() {
    $('#primary-form').submit(function(evt) {
        evt.preventDefault();
        submit();
    });

    function submit() {
        toggleSubmitLoading();
        setTimeout(toggleSubmitLoading,2000);
    }
    
    function toggleSubmitLoading() {
        $('#submit-button').toggle();
        $('#loading').toggle();
    }
});