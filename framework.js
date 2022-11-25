document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('close'))
    {
        let dismissable = event.target.closest(".dismissable");
        if (dismissable)
            dismissable.remove();
    }
});

