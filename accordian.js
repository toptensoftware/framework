import { translateCoords, connectEvents } from '@toptensoftware/jslib';

export function accordian(el)
{
    function update_layout()
    {
        // Get all the sections
        let expanded_sections = el.querySelectorAll(".accordian-section.expanded");
        let collapsed_sections = el.querySelectorAll(".accordian-section:not(.expanded)");

        // Calculate height of collapsed sections
        let collapsed_height = 0;
        for (let cs of collapsed_sections)
        {
            let header = cs.querySelector(".accordian-header");
            collapsed_height += header.offsetHeight;
            cs.style.removeProperty('height');
        }

        // Calculate the total weight of all expanded sections
        let totalWeight = 0;
        for (let es of expanded_sections)
        {
            totalWeight += parseFloat(es.dataset.accordianWeight ?? 1);
        }

        // Set calculated height of expanded sections
        for (let es of expanded_sections)
        {
            let weight = parseFloat(es.dataset.accordianWeight ?? 1);
            es.style.height = `calc( ( 100% - ${collapsed_height}px ) * ${weight / totalWeight} )`
        }
    }

    function capture_layout()
    {
        return Array.from(el.querySelectorAll('.accordian-section')).map(x => ({
            section: x,
            offsetTop: x.offsetTop,
            originalHeight: x.offsetHeight,
            newHeight: x.offsetHeight,
            expanded: x.classList.contains('expanded'),
            weight: parseFloat(x.dataset.accordianWeight ?? 1),
            minHeight: parseFloat(window.getComputedStyle(x).minHeight)
        }));
    }

    function apply_layout(sections)
    {
        for (let s of sections)
        {
            if (s.expanded)
                s.section.dataset.accordianWeight = s.newHeight;
        }

        update_layout();
    }


    function show_section(section, expanded, animated)
    {
        // Capture the current layout
        let sections = capture_layout();

        // Get index of section we're expanding or collapsing
        let section_index = sections.findIndex(x => x.section == section);
        if (section_index < 0)
            return;

        // Work with captured state, not original element
        section = sections[section_index];

        // Already in correct state?
        if (section.expanded == expanded)
            return;

        // If expanding/collapsing the last section and all other sections are collapsed
        // then don't animate - just show/hide the last section's content
        if (section_index == sections.length - 1)
        {
            if (sections.every(x => !x.expanded || x == section))
                animated = false;
        }

        if (section.expanded)
        {
            // Section is currently expanded and will be collapsed so we need to 
            // distribute its height across other elements.
            let headerHeight = section.section.querySelector('.accordian-header').offsetHeight;
            let extraHeight = section.section.offsetHeight - headerHeight;

            // Add first to sections after
            for (let i=sections.length - 1; i > section_index && extraHeight != 0; i--)
            {
                if (sections[i].expanded)
                {
                    sections[i].newHeight += extraHeight;
                    extraHeight = 0;
                }
            }

            // Then to sections before
            for (let i=section_index - 1; i>=0 && extraHeight != 0; i--)
            {
                if (sections[i].expanded)
                {
                    sections[i].newHeight += extraHeight;
                    extraHeight = 0;
                }
            }

            // Save the old height (unless it was maximized)
            if (sections.reduce((t,s) => t + (s.expanded ? 1 : 0), 0) > 1)
                section.section.dataset.accordianWeight = section.originalHeight;

            // Mark as no longer expanded and store new collapsed height
            section.expanded = false;
            section.newHeight = headerHeight;
        }
        else
        {
            // Section is currently collapsed and will be expanded. Work out what
            // height to set it to
            let newHeight;
            if (section.section.dataset.accordianWeight !== undefined)
            {
                // Section was previously shown so use its saved height
                newHeight = parseFloat(section.section.dataset.accordianWeight);
            }
            else
            {
                // Section has never been explicitly collapsed or sized, use a proportion
                // of the availeble height based on the number of expanded sections
                let expandedSections = sections.reduce((t,x) => t + (x.expanded ? 1 : 0), 0);
                newHeight = el.clientHeight / (1 + expandedSections);
            }

            // If there are any currently expanded sections, then steal space from them
            if (sections.some(x => x.expanded))
            {
                let headerHeight = section.section.querySelector('.accordian-header').offsetHeight;
                let extraHeight = newHeight - headerHeight;
    
                // Steal extra space from other expanded elements
                for (let i=sections.length - 1; i > section_index && extraHeight != 0; i--)
                {
                    if (sections[i].expanded)
                    {
                        sections[i].newHeight -= extraHeight;
                        if (sections[i].newHeight < sections[i].minHeight)
                            sections[i].newHeight = sections[i].minHeight;
                        extraHeight -= sections[i].originalHeight - sections[i].newHeight;
                    }
                }
    
                // Then from sections before
                for (let i=section_index - 1; i>=0 && extraHeight != 0; i--)
                {
                    if (sections[i].expanded)
                    {
                        sections[i].newHeight -= extraHeight;
                        if (sections[i].newHeight < sections[i].minHeight)
                            sections[i].newHeight = sections[i].minHeight;
                        extraHeight -= sections[i].originalHeight - sections[i].newHeight;
                    }
                }
    
                // Adjust in case couldn't fit desired size
                section.newHeight = newHeight - extraHeight;
            }
            else
            {
                // This will be the only expanded section, so it doesn't matter what
                // we set this too.
                section.newHeight = newHeight;
            }
             
            // Now expanded
            section.expanded = true;
        }
        
        // Command changes to layout
        function commit()
        {
            if (expanded)
                section.section.classList.add('expanded');
            else
                section.section.classList.remove('expanded');

            apply_layout(sections);
        }

        // Apply the layout
        if (!animated)
        {
            commit();
            return;
        }

        // Calculate the new position of each section
        let y = 0;
        for (let s of sections)
        {
            s.newOffsetTop = y;
            y += s.newHeight;
        }

        // Prepare sections for animation
        for (let s of sections)
        {
            // Temporarily switch all sections to aboslute positioning
            // so we can have them slide over each other
            s.section.style.position = 'absolute';
            s.section.style.top = Math.round(s.newOffsetTop) + "px";
            s.section.style.left = '0';
            s.section.style.right = '0';

            // Set the height to the max of it's old and new heights
            s.section.style.height = Math.max(s.originalHeight, s.newHeight) + "px";

            if (s == sections[sections.length - 1])
            {
                s.section.style.height = el.clientHeight + "px";
            }

            // Setup transform to move the section back to its original location
            s.section.style.transform = `translateY(${s.offsetTop - s.newOffsetTop}px)`;
        }

        if (expanded)
        {
            section.section.classList.add("expanded");
        }

        let animation_duration = 200;
        let animation_delay = 10;

        // Setup transition
        setTimeout(function() {
            for (let s of sections)
            {
                s.section.style.transform = `translateY(0)`;
                s.section.style.transition = `transform ${animation_duration}ms ease-in`;
            }
        }, animation_delay);

        setTimeout(function() { 

            // Remove aboslution positioning
            for (let s of sections)
            {
                s.section.style.removeProperty('position');
                s.section.style.removeProperty('top');
                s.section.style.removeProperty('left');
                s.section.style.removeProperty('right');
                s.section.style.removeProperty('height');
                s.section.style.removeProperty('transform');
                s.section.style.removeProperty('transition');
            }

            // Commit new layout
            commit();
        }, animation_duration + animation_delay);

        return;
    }


    // Get an array of section elements that are currently resizeable
    // (note collapsed sections between resizeable sections are also resizeable)
    function get_resizeable_sections()
    {
        // Build list of resizable sections (not the first and not trailing collapsed)
        let sections = Array.from(el.querySelectorAll('.accordian-section'));
        while (sections.length > 0 && !sections[0].classList.contains('expanded'))
            sections.shift();
        sections.shift();
        while (sections.length > 0 && !sections[sections.length-1].classList.contains('expanded'))
            sections.pop();
        return sections;
    }

    function hittest_resizeable_sections(event)
    {
        // Get resizeable sections
        let sections = get_resizeable_sections();

        let tolerance = 5;
        if (event.pointerType == "touch")
            tolerance *= 2;

        // Hit test
        for (let i = 0; i < sections.length; i++)
        {
            let s = sections[i];
            let sp = translateCoords({ x: event.offsetX, y: event.offsetY }, event.target, s);
            if (sp.y >= -tolerance && sp.y <= tolerance)
            {
                return s;
            }
        }

        return null;
    }

    let highlight_section;
    let pending_highlight_timeout;
    function highlight_resize_section(section)
    {
        // Get the current resize section
        if (highlight_section == section)
            return;

        // Clear pending highlight
        if (pending_highlight_timeout)
        {
            clearTimeout(pending_highlight_timeout);
            pending_highlight_timeout = null;
        }

        // Remove resizing class from old
        if (highlight_section)
            highlight_section.classList.remove('resizing');
        
        // Store it
        highlight_section = section;

        // Add to new
        if (section)
        {
            pending_highlight_timeout = setTimeout(function() {
                highlight_section.classList.add('resizing');
                pending_highlight_timeout = null;
            }, 250);
        }

    }

    // Setup initial layout
    update_layout();

    let suppressClick;
    
    // On click handler to expand/collapse sections
    el.addEventListener('click', function(event) {
        if (suppressClick && Date.now() - suppressClick < 50)
        {
            suppressClick = null;
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.target.classList.contains('accordian-header'))
        {
            let elSection = event.target.closest(".accordian-section") 
            show_section(elSection, !elSection.classList.contains('expanded'), true);

            // Prevent other actions, hide resize highlight
            highlight_resize_section(null);
            event.preventDefault();
            return;
        }
    });

    // Mouse move to show cursor/highlight when over section resizer
    el.addEventListener('mousemove', function(event) {
    
        // Hit test
        let resizeSection = hittest_resizeable_sections(event);

        // Show resize highlight on this section (after a small delay)
        highlight_resize_section(resizeSection);

        // Set resizing on the root accordian element to show resize cursor
        if (resizeSection)
            el.classList.add('resizing');
        else
            el.classList.remove('resizing');
    });

    // Remove resize highlight if mouse leaves
    el.addEventListener('mouseleave', function() {
        highlight_resize_section(null);
    });

    let dragPointerId = null;
    el.addEventListener('pointerdown', function(event) {

        // Only one pointer at a time
        if (dragPointerId)
            return;

        // Work out which sections to resize
        let hit_section = hittest_resizeable_sections(event);
        if (!hit_section)
            return;

        // Capture info about all the sections
        let sections = capture_layout();

        // Find index of hit section
        let hit_index = sections.findIndex(x => x.section == hit_section);
        if (hit_index < 0)
            return;

        // Remember which pointer we're dragging
        dragPointerId = event.pointerId;

        // Connect event handlers
        let disconnect = connectEvents(el, {
            pointermove: drag,
            pointerup: { el: window, handler: finishDrag },
            pointercancel: finishDrag,
        });

        let startY = event.clientY;

        function apply_dy(start, delta, stop, dy)
        {
            let dy_applied = 0;
            for (let i = start; i != stop && Math.abs(dy) > 0.001; i += delta)
            {
                let s = sections[i];
                if (!s.expanded)
                    continue;
                let newHeight = s.originalHeight + dy;
                if (newHeight < s.minHeight)
                    newHeight = s.minHeight;
                s.newHeight = newHeight;
                dy -= newHeight - s.originalHeight;
                dy_applied += newHeight - s.originalHeight;
            }
            return dy_applied;
        }

        function drag(event)
        {
            if (event.pointerId != dragPointerId)
                return;
            event.preventDefault();
            event.stopPropagation();

            // Calculate the new height of each element, by first
            // working in the direction that's getting smaller and 
            // successively reducing size, but not below min-height
            let dy = event.clientY - startY;
            if (dy < 0)
            {
                dy = apply_dy(hit_index - 1, -1, -1, dy);
                dy = apply_dy(hit_index, 1, sections.length, -dy);
            }
            else
            {
                dy = apply_dy(hit_index, 1, sections.length, -dy);
                dy = apply_dy(hit_index - 1, -1, -1, -dy);
            }

            // Apply changes
            apply_layout(sections);
        }

        function finishDrag()
        {
            if (event.pointerId != dragPointerId)
                return;

            suppressClick = Date.now();
            event.preventDefault();
            event.stopPropagation();
            disconnect();
            dragPointerId = null;
        }

    });

    function save_layout()
    {
        let layout = {};
        let index = 0;
        for (let s of el.querySelectorAll(".accordian-section"))
        {
            let key = s.dataset.layoutKey ?? `#${index}`;
            layout[key] = {
                expanded: s.classList.contains("expanded"),
                weight: parseFloat(s.dataset.accordianWeight ?? 1),
            },
            index++;
        }
        return layout;
    }

    function load_layout(layout)
    {
        let index = 0;
        for (let s of el.querySelectorAll(".accordian-section"))
        {
            let key = s.dataset.layoutKey ?? `#${index}`;
            let l = layout[key];
            if (l)
            {
                if (l.expanded)
                    s.classList.add("expanded");
                else
                    s.classList.remove("expanded");
                s.dataset.accordianWeight = l.weight;
            }
            index++;
        }
        update_layout();
    }

    return {
        show_section,
        save_layout,
        load_layout,
    }

}
