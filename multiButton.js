
// Implements a "multi-button" - a group of buttons
// to which the user can tab to, and use left/right
// arrow keys to move between.
export function multiButton(el)
{
    // Set which button is the current button
    // an will be tabbed to
    function setCurrent(button)
    {
        let buttons = Array.from(el.querySelectorAll("button"));
        if (buttons.indexOf(button) < 0)
            button = buttons[0];
        for (let b of buttons)
        {
            b.setAttribute('tabindex', b == button ? '0' : '-1');
        }
    }

    // Move focus between buttons in the group
    function moveFocus(direction)
    {
        // Find buttons
        let buttons = Array.from(el.querySelectorAll("button"));
        if (buttons.length < 0)
            return;

        // Find current
        let index = buttons.indexOf(document.activeElement);
        if (index < 0)
            index = 0;
        else
            index += direction;

        // Wrap
        if (index < 0)
            index = buttons.length - 1;
        if (index >= buttons.length)
            index = 0;
        
        // Mark as current
        setCurrent(buttons[index]);

        // Give it focus
        buttons[index].focus();
    }

    // Keyboard navigation
    el.addEventListener('keydown', function(event) {

        switch(event.code)
        {
            case "ArrowLeft":
            case "ArrowLeft":
                moveFocus(-1);
                break;

            case "ArrowRight":
            case "ArrowDown":
                moveFocus(1);
                break;
        }

    });

    // When one of the buttons get focus, make it the
    // current tabbable button
    el.addEventListener('focusin', function(event) {
        setCurrent(event.target);
    });

    // Set the first button as the tabbable one
    setCurrent(null);
}