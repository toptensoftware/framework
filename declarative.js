function is_declarative_container(target)
{
    switch (target.tagName)
    {
        case 'LABEL':
        case 'INPUT':
        case 'BUTTON':
        case 'A':
        case 'FORM':
        case 'SECTION':
        case 'FIELDSET':
            return true;
    }

    return target.classList.contains('popover') 
        || target.classList.contains('modal-frame')
        || target.classList.contains('dialog')
        || target.classList.contains('menu');
}

function* walk_declarative_scope(target)
{
    while (target)
    {
        yield target;
        if (is_declarative_container(target))
            break;
        target = target.parentElement;
    }
}


let listeners = {};
export function declarativeAddEventListener(eventName, handler)
{
    // Get existing listeners for this event and if exists
    // just add to the collection
    let l = listeners[eventName];
    if (l)
    {
        l.push(handler);
        return;
    }

    // Create a new collection for the event and store in map
    l = [handler];
    listeners[eventName] = l;

    // Add root event listener
    document.body.addEventListener(eventName, function(event) {

        // Walk parent elements in the declarative scope
        for (let el of walk_declarative_scope(event.target))
        {
            // Call each handler and quit if handled
            for (let h of l)
            {
                if (h(el, event))
                {
                    return;
                }
            }
        };

    });
}