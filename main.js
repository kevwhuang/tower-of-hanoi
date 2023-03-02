// Declare common variables
const ET = 'click';
const colorMap = {
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'green',
    5: 'blue',
    6: 'indigo',
    7: 'violet',
    8: 'pink',
};

// Load DOM elements
const copyright = document.querySelector('#copyright');
const counter = document.querySelector('#counter');
const decrease = document.querySelector('#decrease');
const difficulty = document.querySelector('#difficulty');
const increase = document.querySelector('#increase');
const minimum = document.querySelector('#minimum');
const mute = document.querySelector('#mute');
const rod1 = document.querySelector('#rod1');
const rod2 = document.querySelector('#rod2');
const rod3 = document.querySelector('#rod3');
const rules = document.querySelector('#rules');
const start = document.querySelector('#start');
const stopwatch = document.querySelector('#stopwatch');
const theme = document.querySelector('#theme');
const victory = document.querySelector('#victory');
const volume = document.querySelector('#volume');

// Import audio assets
const audioIllegal = new Audio('assets/toh_illegal.wav');
const audioMove = new Audio('assets/toh_move.wav');
const audioStart = new Audio('assets/toh_start.wav');
const audioVictory = new Audio('assets/toh_victory.wav');

// Declare tracking variables
let dragID = elapsed = len1 = len2 = len3 = moves = 0;
let rod1Disks = [];
let rod2Disks = [];
let rod3Disks = [];
let win = [];

// =================================================================================================

// Display copyright
copyright.addEventListener(ET, () => {
    alert('© 2022 Kevin Huang');
});

// Increase number of starting disks
increase.addEventListener(ET, () => {
    const level = parseInt(difficulty.innerText[7]);

    if (level < 8) {
        difficulty.innerText = 'Disks: ' + (level + 1).toString();
    }
});

// Decrease number of starting disks
decrease.addEventListener(ET, () => {
    const level = parseInt(difficulty.innerText[7]);

    if (level > 1) {
        difficulty.innerText = 'Disks: ' + (level - 1).toString();
    }
});

// Display game rules
rules.addEventListener(ET, () => {
    alert(`
    (1) Only one disk may be moved at a time.
    (2) Each move consists of taking the upper disk from one of the
          stacks and placing it on top of another stack or on an empty
          rod.
    (3) No disk may be placed on top of a disk that is smaller than it.
    (4) Victory is achieved when all the disks have been moved to the
          rightmost rod.
    `);
});

// Mute and unmute audio
mute.addEventListener(ET, () => {
    if (volume.innerHTML === 'volume_off') {
        audioIllegal.muted = audioMove.muted = audioStart.muted = audioVictory.muted = false;
        volume.innerHTML = 'volume_up';
    } else {
        audioIllegal.muted = audioMove.muted = audioStart.muted = audioVictory.muted = true;
        volume.innerHTML = 'volume_off';
    }
});

// Randomize game area background color
theme.addEventListener(ET, () => {
    const R = Math.random() * (150 - 50) + 50;
    const G = Math.random() * (150 - 50) + 50;
    const B = Math.random() * (150 - 50) + 50;

    document.querySelector('main').style.backgroundColor = 'rgb(' + R + ', ' + G + ', ' + B + ')';
});

// =================================================================================================

// Keep checking for win condition
addEventListener('mouseover', () => {
    if (win.join() === rod3Disks.join() && moves > 0 && elapsed > 0) {
        audioVictory.play();
        win = [];

        rod1.style.cursor = rod2.style.cursor = rod3.style.cursor = 'default';
        rod1.setAttribute('draggable', 'false');
        rod2.setAttribute('draggable', 'false');
        rod3.setAttribute('draggable', 'false');

        clearInterval(totalTime);
        alert(`
        Congratulations!\n
        You have won with ${difficulty.innerText[7]} disks!\n
        It took you ${counter.innerHTML} moves in ${stopwatch.innerHTML} seconds!
        `);
    }
});

// Keep refreshing the graphics
setInterval(paint, 200);

// =================================================================================================

start.addEventListener(ET, () => {
    let level = parseInt(difficulty.innerText[7]);

    // Reset tracking states
    minimum.innerHTML = (2 ** level) - 1;
    moves = 0;
    rod1Disks = [];
    rod2Disks = [];
    rod3Disks = [];

    // Reset rod states
    rod1.style.cursor = rod2.style.cursor = rod3.style.cursor = 'move';
    rod1.setAttribute('draggable', 'true');
    rod2.setAttribute('draggable', 'true');
    rod3.setAttribute('draggable', 'true');

    // Reset game timer
    try {
        clearInterval(totalTime);
    } catch { }

    // Construct initial rod
    while (level > 0) {
        rod1Disks.unshift(level);
        --level;
    }

    // Initiate game
    audioStart.play();
    counter.innerHTML = moves++;
    elapsed = 0;
    stopwatch.innerHTML = 0;
    win = [...rod1Disks];

    timer();
});

// =================================================================================================

// Utilize drag & drop API to add event listeners for every rod
for (const rod of [rod1, rod2, rod3]) {
    rod.addEventListener('dragstart', e => {
        e.target.style.opacity = '0.5';
    });
    rod.addEventListener('dragenter', e => {
        e.target.classList.add('background');
    });
    rod.addEventListener('dragover', e => {
        e.preventDefault();
    });
    rod.addEventListener('dragleave', e => {
        e.target.classList.remove('background');
    });
    rod.addEventListener('drop', e => {
        e.target.classList.remove('background');
    });
    rod.addEventListener('dragend', e => {
        e.target.style.opacity = '1';
    });
}

// Identify drag source
rod1.addEventListener('drag', () => { dragID = 1; });
rod2.addEventListener('drag', () => { dragID = 2; });
rod3.addEventListener('drag', () => { dragID = 3; });

// Execute drop for rod 1
rod1.addEventListener('drop', () => {
    switch (dragID) {
        case 2:
            move21();
            break;
        case 3:
            move31();
            break;
    }
});

// Execute drop for rod 2
rod2.addEventListener('drop', () => {
    switch (dragID) {
        case 1:
            move12();
            break;
        case 3:
            move32();
            break;
    }
});

// Execute drop for rod 3
rod3.addEventListener('drop', () => {
    switch (dragID) {
        case 1:
            move13();
            break;
        case 2:
            move23();
            break;
    }
});

// =================================================================================================

// Retrieve rod lengths
const lengths = () => {
    len1 = rod1Disks.length;
    len2 = rod2Disks.length;
    len3 = rod3Disks.length;
}

// Start game timer
const timer = () => {
    totalTime = setInterval(() => { ++elapsed; stopwatch.innerHTML = elapsed }, 1000);
}

function paint() {
    // Parmetrize dimensions
    const canvasTop = document.querySelector('main').offsetTop;
    const rodHeight = window.innerHeight - canvasTop;
    const rodWidth = window.innerWidth / 3;
    const xFactor = window.innerWidth / 100;
    const yFactor = window.innerHeight / 30 - 10 / 3;

    // Paint all rods
    for (const rod of [rod1, rod2, rod3]) {
        const draw = rod.getContext('2d');

        rod.height = rodHeight;
        rod.width = rodWidth;
        draw.lineWidth = yFactor;
        draw.strokeStyle = '#000';
        draw.beginPath();
        draw.moveTo(rodWidth * 0.5, rodHeight * 0.8);
        draw.lineTo(rodWidth * 0.5, rodHeight * 0.2);
        draw.moveTo(rodWidth * 0.5, rodHeight * 0.8);
        draw.lineTo(rodWidth * 0.2, rodHeight * 0.8);
        draw.moveTo(rodWidth * 0.5, rodHeight * 0.8);
        draw.lineTo(rodWidth * 0.8, rodHeight * 0.8);
        draw.stroke();
    }

    // Paint rod 1 disks
    for (const n of rod1Disks) {
        paintDisks(rod1.getContext('2d'), n);
    }

    // Pains rod 2 disks
    for (const n of rod2Disks) {
        paintDisks(rod2.getContext('2d'), n);
    }

    // Paint rod 3 disks
    for (const n of rod3Disks) {
        paintDisks(rod3.getContext('2d'), n);
    }

    // Paint disk helper function
    function paintDisks(draw, n) {
        draw.lineWidth = yFactor;
        draw.strokeStyle = colorMap[n];
        draw.beginPath();
        draw.moveTo(rodWidth * 0.5, rodHeight * 0.8 - n * draw.lineWidth);
        draw.lineTo(rodWidth * 0.2 + n * xFactor, rodHeight * 0.8 - n * draw.lineWidth);
        draw.moveTo(rodWidth * 0.5, rodHeight * 0.8 - n * draw.lineWidth);
        draw.lineTo(rodWidth * 0.8 - n * xFactor, rodHeight * 0.8 - n * draw.lineWidth);
        draw.stroke();
    }
}

// =================================================================================================

// Move disk from rod 1 to rod 2
const move12 = () => {
    lengths();

    if (rod1Disks.length !== 0 && (rod1Disks[len1 - 1] > rod2Disks[len2 - 1] || len2 === 0)) {
        audioMove.play();
        counter.innerHTML = moves++;
        rod2Disks.push(rod1Disks.pop());
    } else {
        audioIllegal.play();
    }
}

// Move disk from rod 1 to rod 3
const move13 = () => {
    lengths();

    if (rod1Disks.length !== 0 && (rod1Disks[len1 - 1] > rod3Disks[len3 - 1] || len3 === 0)) {
        audioMove.play();
        counter.innerHTML = moves++;
        rod3Disks.push(rod1Disks.pop());
    } else {
        audioIllegal.play();
    }
}

// Move disk from rod 2 to rod 1
const move21 = () => {
    lengths();

    if (rod2Disks.length !== 0 && (rod2Disks[len2 - 1] > rod1Disks[len1 - 1] || len1 === 0)) {
        audioMove.play();
        counter.innerHTML = moves++;
        rod1Disks.push(rod2Disks.pop());
    } else {
        audioIllegal.play();
    }
}

// Move disk from rod 2 to rod 3
const move23 = () => {
    lengths();

    if (rod2Disks.length !== 0 && (rod2Disks[len2 - 1] > rod3Disks[len3 - 1] || len3 === 0)) {
        audioMove.play();
        counter.innerHTML = moves++;
        rod3Disks.push(rod2Disks.pop());
    } else {
        audioIllegal.play();
    }
}

// Move disk from rod 3 to rod 1
const move31 = () => {
    lengths();

    if (rod3Disks.length !== 0 && (rod3Disks[len3 - 1] > rod1Disks[len1 - 1] || len1 === 0)) {
        audioMove.play();
        counter.innerHTML = moves++;
        rod1Disks.push(rod3Disks.pop());
    } else {
        audioIllegal.play();
    }
}

// Move disk from rod 3 to rod 2
const move32 = () => {
    lengths();

    if (rod3Disks.length !== 0 && (rod3Disks[len3 - 1] > rod2Disks[len2 - 1] || len2 === 0)) {
        audioMove.play();
        counter.innerHTML = moves++;
        rod2Disks.push(rod3Disks.pop());
    } else {
        audioIllegal.play();
    }
}
