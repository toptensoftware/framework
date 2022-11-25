let cancelExclusivePopover = {};

/*
Interactions determine what actions close the pop

- hover - mouseleave
- anchor - close when click on original anchor
- outside - close when click anywhere outside popover
- anywhere - close where click inside or outside
*/

let popoverStack = [];

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

    // Helper to get popover data attribute from either the popup itself, or
    // the popup's anchor
    function getPopoverAttribute(name)
    {
        let val = popover.getAttribute(name);
        if (val === undefined || val === null)
        {
            val = target.getAttribute(name);
        }
        return val;
    }

    // Exclusive?
    let exclusiveGroup = getPopoverAttribute('data-sv-popover-group') || 'default';
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
    let place = getPopoverAttribute('data-sv-popover-placement') || 'bottom';
    let popper = Popper.createPopper(target, popover, {
        placement: place,
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
        cancelExclusivePopover[exclusiveGroup] = null;
        popoverStack = popoverStack.filter(x => x.popover != popover);
    }

    let close;

    // Work out actual interaction
    interaction = getPopoverAttribute('data-sv-popover-interaction') || interaction;

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
            if (event && (popover == event.target || popover.contains(event.target)))
                return true;

            close_helper();
            document.body.removeEventListener('click', close);
            return false;
        }
        
        document.body.addEventListener('click', close);
    }

    popoverStack.push({
        anchor: target,
        popover: popover,
        close: close,
    });

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

    // Click on something with a popover?
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

document.body.addEventListener('keydown', function(event) {

    if (event.key === "Escape") {
        let popoverEntry = popoverStack.pop();
        if (popoverEntry)
        {
            popoverEntry.close();
            event.cancelBubble();
            event.preventDefault();
            return false;
        }
    };

}, true);