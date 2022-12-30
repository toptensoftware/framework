import { findControl } from "./utils";

// Support for checkbox labels based on this https://stackoverflow.com/a/48359043/77002


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


export function noStealInit()
{

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

}    
