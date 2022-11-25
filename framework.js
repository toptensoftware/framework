let cancelExclusivePopover = {};

/*
Interactions determine what actions close the pop

- hover - mouseleave
- anchor - close when click on original anchor
- outside - close when click anywhere outside anchor
- anywhere - close where click inside or outside
*/

function sv_popover(target, interaction)
{
    let popover;
    let didCreatePopover;

    // Quit if popover already shown
    if (target.classList.contains('popover-shown'))
    {
        return;
    }

    // Create tooltip popover?
    let tooltipData = target.getAttribute('data-sv-tooltip');
    if (tooltipData)
    {
        popover = document.createElement("div");
        popover.classList.add('tooltip');
        popover.innerText = tooltipData;
        didCreatePopover = true;
        document.body.appendChild(popover);
    }

    // Explicit element?
    let popoverEl = target.getAttribute('data-sv-popover');
    if (popoverEl)
    {
        popover = document.querySelector(popoverEl);
    }

    // Quit if no popover
    if (!popover)
        return;

    // Exclusive?
    let exclusiveGroup = target.getAttribute('data-sv-popover-group') || 'default';
    if (exclusiveGroup)
    {
        if (cancelExclusivePopover[exclusiveGroup])
        {
            cancelExclusivePopover[exclusiveGroup]();
            delete cancelExclusivePopover[exclusiveGroup];
        }
    }

    // Show popover
    popover.classList.add('show');
    target.classList.add('popover-shown');

    // Create popper
    let popper = Popper.createPopper(target, popover, {
        placement: target.getAttribute('data-popper-placement') || 'bottom',
        modifiers: [
            { name: 'offset', options: { offset: [0, 4] }},
        ]
    });

    // Helper to close the popup
    function close_helper()
    {
        // Remove tooltip, popper and event listener
        if (didCreatePopover)
            popover.remove();
        popover.classList.remove('show');
        target.classList.remove('popover-shown');
        popper.destroy();
    }

    let close;

    // Work out actual interaction
    interaction = target.getAttribute('data-sv-popover-interaction') || interaction;

    if (interaction == 'hover')
    {
        close = function(event) 
        {
            close_helper();
            target.removeEventListener('mouseleave', close);
        }
        
        target.addEventListener('mouseleave', close);
    }

    if (interaction == 'anchor')
    {
        close = function(event) 
        {
            close_helper();
            target.removeEventListener('click', close);
            if (event)
                event.stopPropagation();
        }
        
        target.addEventListener('click', close);   
    }

    if (interaction == 'anywhere')
    {
        close = function(event) 
        {
            close_helper();
            document.body.removeEventListener('click', close);
            return false;
        }
        
        document.body.addEventListener('click', close);
    }

    if (interaction == 'outside')
    {
        close = function(event) 
        {
            close_helper();
            document.body.removeEventListener('click', close);
            return false;
        }
        
        document.body.addEventListener('click', function(event) {
            if (popover == event.target || popover.contains(event.target))
                return true;
            close();
        });
    }

    if (exclusiveGroup)
        cancelExclusivePopover[exclusiveGroup] = close;
}

// close on click inside
// close on click outside
// click on anchor always closes

document.body.addEventListener('click', function(event) {
    // Close button
    if (event.target.classList.contains('close'))
    {
        let dismissable = event.target.closest(".dismissable");
        if (dismissable)
            dismissable.remove();
    }

    // Explicit hover interaction
    let interaction = event.target.getAttribute('data-sv-popover-interaction');
    if (interaction)
    {
        if (interaction != 'hover')
            return sv_popover(event.target, 'anywhere');
        return;
    }

    // Implicit hover interaction for popovers
    if (event.target.getAttribute('data-sv-popover'))
        return sv_popover(event.target, 'anywhere');
});

document.body.addEventListener('mouseenter', function(event) {

    // Explicit hover interaction
    let interaction = event.target.getAttribute('data-sv-popover-interaction');
    if (interaction)
    {
        if (interaction == 'hover')
            return sv_popover(event.target, 'hover');
        return;
    }

    // Implicit hover interaction for tool tips
    if (event.target.getAttribute('data-sv-tooltip'))
        return sv_popover(event.target, 'hover');

}, true);