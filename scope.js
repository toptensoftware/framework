let scopeStack = [];


let key_listener_installed = false;
function setup_key_listener()
{
    // Needs changed?
    let need_key_listener = getCurrentScope().keyboard_filters.length > 0;
    if (need_key_listener == key_listener_installed)
        return;

    // Add/remove listener
    if (need_key_listener)
    {
        document.body.addEventListener('keydown', on_key_down, true);
    }
    else
    {
        document.body.removeEventListener('keydown', on_key_down, true);
    }

    // Remember state
    key_listener_installed = need_key_listener;
}

function on_key_down(event)
{
    let scope = getCurrentScope();
    for (let i=scope.keyboard_filters.length - 1; i>=0; i--)
    {
        scope.keyboard_filters[i](event);
        if (event.defaultPrevented)
            return;
    }
}

export function getCurrentScope()
{
    return scopeStack[scopeStack.length-1];
}

export function pushScope()
{
    // Push new scope
    scopeStack.push({
        keyboard_filters: []
    });

    // Setup
    setup_key_listener();
    
    // Return top
    return getCurrentScope();
}

export function popScope()
{
    if (scopeStack.length == 1)
        throw new Error("Can't pop root scope");

    // Pop
    scopeStack.pop();

    // Setup
    setup_key_listener();
}

export function registerScopeKeyFilter(handler, scope)
{
    scope = scope ?? getCurrentScope();
    scope.keyboard_filters.push(handler);
    setup_key_listener();
}

export function revokeScopeKeyFilter(handler, scope)
{
    scope = scope ?? getCurrentScope();
    let index = scope.keyboard_filters.indexOf(handler);
    if (index >= 0)
        scope.keyboard_filters.splice(index, 1);
    setup_key_listener();
}

pushScope();
