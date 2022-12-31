// Check if an element is an data input type field
export function isInputElement(el)
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

// Find the parent control element for an element
export function findControl(el)
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
