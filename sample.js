import './framework.auto.less';
import './framework.less';
import './accordian.less';
import './sample.less';
import * as fw from './index.js';

fw.bindKeys("#keycontext1", {
    "Ctrl+1": "#input1",
    "Ctrl+2": "#input2",
    "Ctrl+3": { selector: "#input3", focus: false }
})                        

fw.multiButton(document.getElementById('multi-button'));

fw.accordian(document.getElementById("accordian"));

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
    fw.modalShow("#code-modal");
    
    //alert(code);
}

for (let s of document.querySelectorAll('div.sample'))
{
    let button = document.createElement("button");
    s.appendChild(button);
    button.addEventListener('click', showCode);
}

function copyTextToClipboard(text) 
{
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
    } 
    finally
    {
        textArea.remove();
    }
}

document.getElementById("copyCode").addEventListener('click', function(){

    let code = document.getElementById('sample-code').innerText;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }

})


document.getElementById('toggle-theme').addEventListener('click', function toggleTheme()
{
    if (document.documentElement.classList.contains('dark'))
    {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
    else
    {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }
});


