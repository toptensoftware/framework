import { createPopper } from '@popperjs/core';
import { declarativeAddEventListener } from './declarative';
import { getCurrentScope, registerScopeKeyFilter, revokeScopeKeyFilter} from './scope';

export function popoverCloseAll()
{
    let scope = getCurrentScope();
    if (scope.popoverStack)
    {
        for (let i=scope.popoverStack.length-1; i>=0; i--)
        {
            scope.popoverStack[i].close();
        }
    }
}

export function popoverCloseTop()
{
    let scope = getCurrentScope();
    if (scope.popoverStack)
    {
        if (scope.popoverStack.length > 0)
        {
            scope.popoverStack[scope.popoverStack.length - 1].close();
            return true;
        }
    }

    return false;
}

function popoverKeyFilter(event)
{
    if (event.code != 'Escape')
        return;

        if (popoverCloseTop())
    {
        event.preventDefault();
        event.stopPropagation();
    }
}

/*
Interactions determine what actions close the pop

- hover - mouseleave
- anchor - close when click on original anchor
- outside - close when click anywhere outside popover
- anywhere - close where click inside or outside
*/
export function popoverShow(target, options)
{
    let scope = getCurrentScope();

    if (!scope.popoverStack)
    {
        scope.popoverStack = [];
        scope.cancelExclusivePopover = {};
    }

    let popover;
    let didCreatePopover;

    // Quit if popover already shown
    if (target.classList.contains('popover-active'))
        return false;

    // Create tooltip popover?
    let tooltipData = target.dataset.fwTooltip;
    if (tooltipData)
    {
        popover = document.createElement("div");
        popover.classList.add('tooltip');
        popover.innerText = tooltipData;
        didCreatePopover = true;
        document.body.appendChild(popover);
    }

    // Explicit element?
    let popoverEl = target.dataset.fwPopover;
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
        if (scope.cancelExclusivePopover[exclusiveGroup])
        {
            scope.cancelExclusivePopover[exclusiveGroup]();
            delete scope.cancelExclusivePopover[exclusiveGroup];
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
        scope.cancelExclusivePopover[exclusiveGroup] = null;
        scope.popoverStack = scope.popoverStack.filter(x => x.popover != popover);
        if (scope.popoverStack.length == 0)
            revokeScopeKeyFilter(popoverKeyFilter, scope);

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

    // Add to stack
    scope.popoverStack.push({
        anchor: target,
        popover: popover,
        close: close,
    });

    // Register exclusive group
    if (exclusiveGroup)
        scope.cancelExclusivePopover[exclusiveGroup] = close;

    // Register escape key handler
    if (scope.popoverStack.length == 1)
        registerScopeKeyFilter(popoverKeyFilter, scope);

    return true;
}


export function popoverInitDeclarative()
{
    document.body.addEventListener('mouseenter', function(event) {

        // Explicit hover interaction
        let interaction = event.target.dataset.fwPopoverInteraction;
        if (interaction)
        {
            if (interaction == 'hover')
                return popoverShow(event.target, { interaction: 'hover' });
            return;
        }
    
        // Implicit hover interaction for tool tips
        if (event.target.dataset.fwTooltip)
            return popoverShow(event.target, { interaction: 'hover' });
    
    }, true);

    declarativeAddEventListener('click', function(el, event) {

        // Click on something with a popover?
        if (el.dataset.fwPopover 
            || el.querySelector(':scope > .popover')
            || el.querySelector(':scope > .menu'))
        {
            event.preventDefault();
            event.stopPropagation();
            return popoverShow(el, { 
                interaction: 'anywhere',
            });
        }
    
        return false;
    });



}