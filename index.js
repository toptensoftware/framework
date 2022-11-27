import "./index.less";
import { sv_modal_show } from "./framework";

function showCode(event)
{
    // Get code lines
    let code = event.target.previousElementSibling.innerHTML;
    let codeLines = code.split('\n');

    // Remove lines that are completely blank
    codeLines = codeLines.map(x => x.replace(/^[ \t]*$/, ''));

    while (codeLines[0] == '')
        codeLines.splice(0, 1);

    // Remove leading whitespace
    let leadingWhitespace = codeLines[0].match(/^[ \t]*/)[0];
    codeLines = codeLines.map(x => {
        if (x.startsWith(leadingWhitespace))
            return x.substring(leadingWhitespace.length);
        else
            return x;
    });
    code = codeLines.join('\n');

    code = code.replace(/<(.*?)>/g, function(o, i, x) {

        if (o.startsWith('<!--') && o.endsWith('-->'))
            return `&lt;<span class='comment'>${i}</span>&gt;`;


        // Highlight the tag
        i = i.replace(/^(\/)?([a-zA-Z0-9]+)( .*)?/, function(o, m1, m2, m3) {
            if (m3)
            {
                m3 = m3.replace(/(.*?)=\'(.*?)\'/g, function(o, m1, m2) {
                    return `<span class='attr'>${m1}</span>='<span class='value'>${m2}</span>'`
                });
                m3 = m3.replace(/(.*?)=\"(.*?)\"/g, function(o, m1, m2) {
                    return `<span class='attr'>${m1}</span>="<span class='value'>${m2}</span>"`
                });
            }
            else
                m3 = '';
            return `${m1??""}<span class='tag'>${m2}</span>${m3}`;
        });
    
    
        return `&lt;${i}&gt;`
    });

        

    document.getElementById('sample-code').innerHTML = code;
    sv_modal_show("#code-modal");
    
    //alert(code);
}

for (let s of document.querySelectorAll('div.sample'))
{
    let button = document.createElement("button");
    s.appendChild(button);
    button.addEventListener('click', showCode);
}