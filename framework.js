import { createPopper } from '@popperjs/core';
import { createFocusTrap } from 'focus-trap';

// ---------------- Popovers ----------------

let popoverStack = [];
let cancelExclusivePopover = {};

export function fw_popover_close_all()
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
export function fw_popover_show(target, options)
{
    let popover;
    let didCreatePopover;

    // Quit if popover already shown
    if (target.classList.contains('popover-active'))
        return false;

    // Create tooltip popover?
    let tooltipData = target.getAttribute('data-fw-tooltip');
    if (tooltipData)
    {
        popover = document.createElement("div");
        popover.classList.add('tooltip');
        popover.innerText = tooltipData;
        didCreatePopover = true;
        document.body.appendChild(popover);
    }

    // Explicit element?
    let popoverEl = target.getAttribute('data-fw-popover');
    if (popoverEl)
    {
        popover = document.querySelector(popoverEl);
    }

    // Look for inline popover
    if (!popover)
    {
        // Must be a direct child of a button or anchor
        if (target.tagName == 'BUTTON' || target.tagName == 'A')
            popover = target.querySelector('.popover,.menu');
    }

    // Quit if no popover
    if (!popover)
        return false;

    let kind = 'popover';
    if (popover.classList.contains('tooltip'))
        kind = 'tooltip';
    else if (popover.classList.contains('menu'))
        kind = 'menu';

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
    let exclusiveGroup = getPopoverAttribute('data-fw-popover-group') || 'default';
    if (exclusiveGroup)
    {
        if (cancelExclusivePopover[exclusiveGroup])
        {
            cancelExclusivePopover[exclusiveGroup]();
            delete cancelExclusivePopover[exclusiveGroup];
        }
    }

    // Fire "will appear" event
    if (!target.dispatchEvent(new Event('fw-popover-will-appear', { bubbles: true, cancelable: true})))
        return false;

    // Show popover
    popover.classList.add('show');
    target.classList.add('popover-active');

    // Work out placement
    let placement = getPopoverAttribute('data-fw-popover-placement');
    if (!placement && kind == 'menu')
        placement = 'bottom-start';
    if (!placement)
        placement = 'bottom'

    let modifiers = [];

    if (kind == 'popover' || kind == 'tooltip')
    {
        let arrow = popover.querySelector('.popover-arrow');
        if (!arrow)
        {
            arrow = document.createElement("div");
            arrow.classList.add('popover-arrow');
            popover.appendChild(arrow);
        }
        
        modifiers.push({
            name: 'offset', 
            options: { offset: [0, 4] }
        });

        modifiers.push({
            name: 'arrow', 
            options: { 
                element: arrow,
                padding: 5
            }, 
        });

    }

    // Create popper
    let popper = createPopper(target, popover, {
        placement,
        modifiers,
    });

    // Trap focus?
    let oldFocus = document.activeElement;
    /*
    let focusTrap = null;
    if (kind != 'tooltip')
    {
        try
        {
            focusTrap = createFocusTrap(popover, {
                escapeDeactivates: true,   
                clickOutsideDeactivates: true,
                allowOutsideClick: false,
                returnFocusOnDeactivate: true,
                preventScroll: true,
            });
            focusTrap.activate();
        }
        catch
        {
            focusTrap = null;
        }
    }
    */

    // Arrow keys?
    if (kind == 'menu')
    {
        document.body.addEventListener('keydown', onkeydown, true);
    }

    function onkeydown(event)
    {
        switch (event.code)
        {
            case 'ArrowUp':
            case 'ArrowDown':
                let allAnchors = [...popover.querySelectorAll('a')];
                let indexCurrent = allAnchors.indexOf(document.activeElement);
                let nextIndex = indexCurrent + (event.code == 'ArrowUp' ? -1 : 1);
                if (nextIndex < 0)
                    nextIndex = allAnchors.length - 1;
                if (nextIndex >= allAnchors.length)
                    nextIndex = 0;
                allAnchors[nextIndex].focus();
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Enter':
                let el = document.activeElement;
                if (popover.contains(el))
                {
                    el.click();
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;

        }
    }

    // Helper to close the popup
    function close_helper()
    {
        // Remove tooltip, popper and event listener
        if (didCreatePopover)
            popover.remove();
        popover.classList.remove('show');
        target.classList.remove('popover-active');
        popper.destroy();
        cancelExclusivePopover[exclusiveGroup] = null;
        popoverStack = popoverStack.filter(x => x.popover != popover);

        if (kind == 'menu')
        {
            document.body.removeEventListener('keydown', onkeydown, true);
        }

        if ((document.activeElement.tagName == 'BODY' || popover.contains(document.activeElement)) && oldFocus.isConnected)
        {
            oldFocus.focus();
        }

        // Fire "did disappear" event
        if (!target.dispatchEvent(new Event('fw-popover-did-disappear', { bubbles: true, cancelable: true})))
            return;
    }

    
    // Work out actual interaction
    let interaction = getPopoverAttribute('data-fw-popover-interaction') || options.interaction || 'anywhere';
    
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

    return true;
}


// ---------------- Modals ----------------

let _currentModal;
let modalFocusTrap;

export function fw_modal_show(elOrSel)
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
    if (!modal.dispatchEvent(new Event('fw-modal-will-appear', { bubbles: true, cancelable: true})))
        return;

    // Cancel other interactive states
    fw_popover_close_all();
    fw_modal_close();

    // Show modal
    document.body.classList.add('modal-active');
    modal.classList.add('modal-active');

    modalFocusTrap = createFocusTrap(modal, {
        escapeDeactivates: false,   
        clickOutsideDeactivates: false,
        allowOutsideClick: false,
        returnFocusOnDeactivate: true,
        preventScroll: true,
    });
    modalFocusTrap.activate();

    _currentModal = modal;
}

export function fw_modal_close()
{
    if (modalFocusTrap)
    {
        modalFocusTrap.deactivate();
        modalFocusTrap = null;
    }

    if (_currentModal)
    {
        // Hide
        document.body.classList.remove('modal-active');
        _currentModal.classList.remove('modal-active');

        // Fire "will disappear" event
        _currentModal.dispatchEvent(new Event('fw-modal-did-disappear', { bubbles: true, cancelable:false }));

    
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
            || target.classList.contains('dialog')
            || target.classList.contains('menu'))
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
                fw_modal_close();
                event.preventDefault();
                return true;
            }

            let dismissable = target.closest(".dismissable");
            if (dismissable)
                dismissable.remove();
            return true;
        }

        // Click on something with a popover?
        if (target.getAttribute('data-fw-popover') 
            || target.querySelector(':scope > .popover')
            || target.querySelector(':scope > .menu')
        )
        {
            fw_popover_show(target, { 
                interaction: 'anywhere',
            });
            event.preventDefault();
            event.stopPropagation();
            return true;
        }

        // Click on modal?
        let modal = target.getAttribute('data-fw-modal');
        if (modal)
        {
            fw_modal_show(modal);
            return true;
        }

        return false;
    }
});

document.body.addEventListener('mouseenter', function(event) {

    // Explicit hover interaction
    let interaction = event.target.getAttribute('data-fw-popover-interaction');
    if (interaction)
    {
        if (interaction == 'hover')
            return fw_popover_show(event.target, { interaction: 'hover' });
        return;
    }

    // Implicit hover interaction for tool tips
    if (event.target.getAttribute('data-fw-tooltip'))
        return fw_popover_show(event.target, { interaction: 'hover' });

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
            fw_modal_close();
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    };

}, true);



// ---------------- no-steal-focus ----------------

// Support for checkbox labels based on this https://stackoverflow.com/a/48359043/77002


function findControl(el)
{
    while (el)
    {
        switch (el.tagName)
        {
            case 'LABEL':
            case 'INPUT':
            case 'BUTTON':
            case 'A':
                // Definite control
                return el;
                
            case 'FORM':
            case 'SECTION':
            case 'P':
            case 'FIELDSET':
            case 'LI':
                // A couple of early break outs
                return null;

            default:
                el = el.parentElement;
                break;
        }
    }
    return el;
}

function isNoStealControl(el)
{
    if (el == null)
        return false;
    let elClosest = el.closest('.no-steal-focus,.steal-focus');
    if (!elClosest)
        return false;
    return elClosest.classList.contains('no-steal-focus');
}

function isNoStealLabel(el)
{
    if (el == null)
        return false;
    return el.tagName == 'LABEL' && isNoStealControl(el.control);
}


document.body.addEventListener('click', function(event) 
{
    let control = findControl(event.target);
    if (isNoStealLabel(control))
    {
        event.preventDefault();
        control.control?.click();
    }
});

document.body.addEventListener('mousedown', function(event)
{
    let control = findControl(event.target);
    if (isNoStealControl(control) || isNoStealLabel(control))
    {
        event.preventDefault();
    }
})



// ---------------- keybindings ----------------

// Check if an element is an data input type field
function isInputElement(el)
{
    if (el.tagName == "INPUT")
    {
        switch (el.getAttribute('type'))
        {
            case "button":
            case "checkbox":
            case "hidden":
            case "radio":
            case "reset":
                return false;
        }

        return true;
    }

    return false;
}

export function fw_bind_keys(elContext, keys)
{
    if (typeof(elContext) == "string")
        elContext = document.querySelector(elContext);

    if (!elContext)
        return;

    for (let keyname of Object.keys(keys))
    {
        let action = keys[keyname];
        if (typeof(action) === 'function')
        {
            keys[keyname] = { handler: action }
        }
        if (typeof(action) === 'string')
        {
            keys[keyname] = { selector: action }
        }
    }

    elContext.addEventListener("keydown", handler);

    function handler(event)
    {
        // Ignore modifier keys
        if (event.key == "Shift" || event.key == "Control" || event.key == "Alt" || event.key == "Meta")
            return;

        // Work out name of key
        let modifiers = "";
        if (event.ctrlKey)
            modifiers += "Ctrl+";
        if (event.shiftKey)
            modifiers += "Shift+";
        if (event.altKey)
            modifiers += "Alt+";
        let keyname = modifiers + event.key;

        // Look up binding
        let action = keys[keyname];
        if (!action)
        {
            let code = event.code;
            if (code.startsWith('Key'))
                code = code.substring(3);
            if (code.startsWith('Digit'))
                code = code.substring(5);
            keyname = modifiers + code;
            action = keys[keyname]
        }

        if (action)
        {
            console.log("Detected", keyname);
            if (action.handler)
            {
                action.handler(event);
            }
            if (action.selector)
            {
                let elAction = elContext.querySelector(action.selector);
                if (action.focus !== false)
                    elAction.focus();

                if (action.click || (action.click !== false && !isInputElement(elAction)))
                    elAction.click();
            }

            if (action.preventDefault !== false)
                event.preventDefault();
                
            if (action.stopPropagation !== false)
                event.stopPropagation();
        }
    }

    return function() { 
        elContext.removeEventListener("keydown", handler);
    }
}
