import { isInputElement } from "./utils";

export function bindKeys(elContext, keys)
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
