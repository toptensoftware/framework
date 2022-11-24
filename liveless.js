let fs = require('fs');
let child_process = require('child_process');

let count=1;

function watch(basename)
{
    let timeout;
    fs.watch(`${basename}.less`, {}, (event, filename) => {
    
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log(`# ${count++} lessc ${basename}`);
            child_process.spawn(`lessc ${basename}.less ${basename}.css`, {
                stdio: 'inherit',
                shell: true
            });
        }, 100)
    
    });

}

watch("framework")
watch("framework.theme");