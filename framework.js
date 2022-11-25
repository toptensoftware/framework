document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('close'))
    {
        let dismissable = event.target.closest(".dismissable");
        if (dismissable)
            dismissable.remove();
    }
});

let _currentPopper;
let _currentTooltip;

document.body.addEventListener('mouseenter', function(event) {

    // Find tooltip data
    let tooltipData = event.target.getAttribute('data-sv-tooltip');
    if (!tooltipData)
        return;

    // Create tooltip
    let _currentTooltip = document.createElement("div");
    _currentTooltip.classList.add('tooltip');
    _currentTooltip.innerText = tooltipData;
    document.body.appendChild(_currentTooltip);

    // Create popper
    _currentPopper = Popper.createPopper(event.target, _currentTooltip, {
        placement: event.target.getAttribute('data-popper-placement') || 'bottom',
        modifiers: [
            { name: 'offset', options: { offset: [0, 4] }},
        ]
    });

    _currentPopper.update();

    event.target.addEventListener('mouseleave', function(event) {

        // Remove tooltip
        if (_currentTooltip)
            _currentTooltip.remove();

        // Remove popper
        if (_currentPopper)
        {
            _currentPopper.destroy();
            _currentPopper = null;
        }
    });
    
}, true);