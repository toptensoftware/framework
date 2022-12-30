import { createFocusTrap } from 'focus-trap';
import { declarativeAddEventListener } from './declarative';

let _currentModal;
let modalFocusTrap;

export function modalShow(elOrSel)
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

    // Cancel current modal
    modalClose();

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

    // Watch for escape key
    modal.addEventListener('keydown', onModalKeyDown, true);
}

function onModalKeyDown(event)
{
    if (event.code != 'Escape')
        return;

    modalClose();

    event.preventDefault();
    event.stopPropagation();
}

export function modalClose()
{
    if (modalFocusTrap)
    {
        modalFocusTrap.deactivate();
        modalFocusTrap = null;
    }

    if (_currentModal)
    {
        // Clean up event listener
        _currentModal.removeEventListener('keydown', onModalKeyDown, true);

        // Hide
        document.body.classList.remove('modal-active');
        _currentModal.classList.remove('modal-active');

        // Fire "will disappear" event
        _currentModal.dispatchEvent(new Event('fw-modal-did-disappear', { bubbles: true, cancelable:false }));

        // Clean up
        _currentModal = null;
    }
}


export function modalInitDeclarative()
{
    declarativeAddEventListener('click', function(el, event) {

        // Click on modal?
        let modal = el.dataset.fwModal;
        if (modal)
        {
            modalShow(modal);
            event.preventDefault = true;
            return true;
        }

        // Click on close button in a modal
        if (el.classList.contains('close'))
        {
            // Close modal?
            let modal = el.closest('.modal-frame');
            if (modal && _currentModal)
            {
                modalClose();
                event.preventDefault();
                return true;
            }
        }

        return false;
    });
}