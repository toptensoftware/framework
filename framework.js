import './framework.theme.less';
import './framework.less';
import { createPopper } from '@popperjs/core';
import * as focusTrap from 'focus-trap';

// ---------------- Popovers ----------------

let popoverStack = [];
let cancelExclusivePopover = {};

function sv_popover_close_all()
{
    for (let i=popoverStack.length-1; i>=0; i--)
    {
        popoverStack[i].close();
    }
}

/*
Interactions determine what actions close the pop

- hover - mouseleave
- anchor - close when click on original anchor
- outside - close when click anywhere outside popover
- anywhere - close where click inside or outside
*/
function sv_popover_show(target, interaction)
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

    // Look for inline popover
    if (!popover)
    {
        // Must be a direct child of a button or anchor
        if (target.tagName == 'BUTTON' || target.tagName == 'A')
            popover = target.querySelector('.popover');
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
    let popper = createPopper(target, popover, {
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

    
    // Work out actual interaction
    interaction = getPopoverAttribute('data-sv-popover-interaction') || interaction;
    
    let close;
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


// ---------------- Modals ----------------

let _currentModal;
let _focusTrap;

function sv_modal_show(elOrSel)
{
    // Get the modal HTML element
    let modal;
    if (typeof(elOrSel) == 'string')
        modal = document.querySelector(elOrSel);
    else
        modal = elOrSel

    // Check have element
    if (!(modal instanceof HTMLElement))
        return;

    // Fire "will appear" event
    if (!modal.dispatchEvent(new Event('sv-modal-will-appear', { bubbles: true, cancelable: true})))
        return;

    // Cancel other interactive states
    sv_popover_close_all();
    sv_modal_close();

    // Show modal
    document.body.classList.add('modal-active');
    modal.classList.add('modal-active');

    // Add backdrop
    let backdrop = document.createElement("div");
    backdrop.classList.add('modal-backdrop');
    document.body.appendChild(backdrop);

    // Trap focus (if 'focus-trap' script loaded)
    // See: https://github.com/focus-trap/focus-trap
    if (focusTrap)
    {
        _focusTrap = focusTrap.createFocusTrap(modal, {
            escapeDeactivates: false,   
            clickOutsideDeactivates: false,
            allowOutsideClick: false,
            returnFocusOnDeactivate: true,
            preventScroll: true,
        });
        _focusTrap.activate();
    }

    _currentModal = modal;
}

function sv_modal_close()
{
    if (_focusTrap)
    {
        _focusTrap.deactivate();
        _focusTrap = null;
    }

    if (_currentModal)
    {
        // Remove backdrop
        let backdrop = document.querySelector('.modal-backdrop');
        if (backdrop)
            backdrop.remove();
    
        // Hide
        document.body.classList.remove('modal-active');
        _currentModal.classList.remove('modal-active');

        // Fire "will disappear" event
        _currentModal.dispatchEvent(new Event('sv-modal-did-disappear', { bubbles: true, cancelable:false }));

    
        // Clean up
        _currentModal = null;
    }
}



// ---------------- Event Listeners ----------------

document.body.addEventListener('click', function(event) 
{
    let target = event.target;

    while (target && !handle_click(target))
    {
        target = target.parentElement;
        if (!target)
            break;

        if (target.classList.contains('popover') 
            || target.classList.contains('modal-frame')
            || target.classList.contains('dialog'))
        {
            break;
        }
    }

    function handle_click()
    {
        // Close button
        if (target.classList.contains('close'))
        {
            // Close modal?
            let modal = target.closest('.modal-frame');
            if (modal && _currentModal)
            {
                sv_modal_close();
                event.preventDefault();
                return true;
            }

            let dismissable = target.closest(".dismissable");
            if (dismissable)
                dismissable.remove();
            return true;
        }

        // Click on something with a popover?
        if (target.getAttribute('data-sv-popover') || target.querySelector(':scope > .popover'))
        {
            sv_popover_show(target, 'anywhere');
            return true;
        }

        // Click on modal?
        let modal = target.getAttribute('data-sv-modal');
        if (modal)
        {
            sv_modal_show(modal);
            return true;
        }

        return false;
    }
});

document.body.addEventListener('mouseenter', function(event) {

    // Explicit hover interaction
    let interaction = event.target.getAttribute('data-sv-popover-interaction');
    if (interaction)
    {
        if (interaction == 'hover')
            return sv_popover_show(event.target, 'hover');
        return;
    }

    // Implicit hover interaction for tool tips
    if (event.target.getAttribute('data-sv-tooltip'))
        return sv_popover_show(event.target, 'hover');

}, true);

document.body.addEventListener('keydown', function(event) {

    if (event.key === "Escape") 
    {
        // Cancel popover
        let popoverEntry = popoverStack.pop();
        if (popoverEntry)
        {
            popoverEntry.close();
            event.stopPropagation();
            event.preventDefault();
            return false;
        }

        // Cancel modal
        if (_currentModal)
        {
            sv_modal_close();
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    };

}, true);

