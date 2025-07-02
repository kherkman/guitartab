const TabEditor = (() => {
    // --- PRIVATE STATE & CONFIG ---
    let mainState; // Reference to the main app's state
    let dom; // References to DOM elements passed from main app
    let helpers; // Helper functions from the main app
    let audio; // AudioPlayer from the main app

    let tabState = {
        data: [],
        tempo: 120,
        playheadPosition: -1,
        isPlaying: false,
        intervalId: null,
        numCols: 48,
    };

    // --- PRIVATE FUNCTIONS (moved from main script) ---

    /**
     * Renders the entire tab editor grid into the DOM.
     */
    function render() {
        dom.tabGrid.innerHTML = '';
        dom.tabGrid.style.gridTemplateColumns = `auto repeat(${tabState.numCols}, 2.2ch)`;

        const stringIndices = Array.from({ length: mainState.strings.length }, (_, k) => k);
        if (mainState.isPlayerView) { stringIndices.reverse(); }

        stringIndices.forEach(stringIndex => {
            const stringName = document.createElement('div');
            stringName.className = 'tab-string-name';
            const freq = helpers.calculateFrettedFrequency(stringIndex, -1); // Use open string
            stringName.textContent = helpers.frequencyToNoteName(freq);
            dom.tabGrid.appendChild(stringName);

            for (let colIndex = 0; colIndex < tabState.numCols; colIndex++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'tab-cell';
                cell.maxLength = 2;
                cell.dataset.stringIndex = stringIndex;
                cell.dataset.colIndex = colIndex;
                cell.value = tabState.data[stringIndex]?.[colIndex] || '-';
                cell.addEventListener('input', handleTabCellChange);
                dom.tabGrid.appendChild(cell);
            }
        });
    }

    /**
     * Handles user input into a tab cell, sanitizes it, and updates the state.
     * @param {Event} e The input event from a tab cell.
     */
    function handleTabCellChange(e) {
        const input = e.target;
        const stringIndex = parseInt(input.dataset.stringIndex, 10);
        const colIndex = parseInt(input.dataset.colIndex, 10);

        let value = input.value.trim();
        const validChars = /^[0-9]$|^[1-9][0-9]$|^[/\\]$|^[hH]$|^[pP]$|^[~]$|^[+]$|^[xX]$|^[-]$/;

        if (!validChars.test(value)) {
            value = '-';
        }
        if (value === '') value = '-';

        input.value = value;
        tabState.data[stringIndex][colIndex] = value;
    }

    /**
     * Starts playback of the tablature.
     */
    function play() {
        if (tabState.isPlaying) return;
        audio.init();
        tabState.isPlaying = true;
        dom.playTabBtn.textContent = '❚❚ Pause';
        tabState.playheadPosition = -1;
        dom.tabPlayhead.style.display = 'block';

        const msPerStep = 60000 / tabState.tempo / 4; // Assuming 16th note steps

        tabState.intervalId = setInterval(() => {
            tabState.playheadPosition++;
            if (tabState.playheadPosition >= tabState.numCols) {
                stop();
                return;
            }

            const stringNameWidth = dom.tabGrid.querySelector('.tab-string-name')?.offsetWidth || 0;
            const cellWidth = dom.tabGrid.querySelector('.tab-cell')?.offsetWidth || 0;
            dom.tabPlayhead.style.transform = `translateX(${stringNameWidth + (tabState.playheadPosition * cellWidth)}px)`;

            document.querySelectorAll('.fret-space.tab-playing').forEach(el => el.classList.remove('tab-playing'));

            for (let i = 0; i < mainState.strings.length; i++) {
                const cellValue = tabState.data[i][tabState.playheadPosition];
                const fretNumber = parseInt(cellValue, 10);

                if (!isNaN(fretNumber) && fretNumber >= 0 && fretNumber <= mainState.frets) {
                    const fretIndex = (fretNumber === 0) ? -1 : fretNumber - 1;
                    const freq = helpers.calculateFrettedFrequency(i, fretIndex);

                    if (freq > 0) {
                        audio.playNote(freq, 0);
                        const fretSpaceEl = document.querySelector(`.fret-space[data-string-index='${i}'][data-fret-index='${fretIndex}']`);
                        if (fretSpaceEl) fretSpaceEl.classList.add('tab-playing');
                    }
                }
            }
        }, msPerStep);
    }

    /**
     * Stops tablature playback.
     */
    function stop() {
        clearInterval(tabState.intervalId);
        tabState.isPlaying = false;
        dom.playTabBtn.textContent = '▶ Play';
        dom.tabPlayhead.style.display = 'none';
        document.querySelectorAll('.fret-space.tab-playing').forEach(el => el.classList.remove('tab-playing'));
    }

    /**
     * Adds a column to the end of the tablature.
     */
    function addColumn() {
        stop();
        tabState.numCols++;
        tabState.data.forEach(row => row.push('-'));
        render();
    }

    /**
     * Removes the last column from the tablature.
     */
    function removeColumn() {
        if (tabState.numCols <= 1) return;
        stop();
        tabState.numCols--;
        tabState.data.forEach(row => row.pop());
        render();
    }

    /**
     * Exports the current tab data to the text area in standard tab format.
     */
    function exportToText() {
        let output = '';
        const stringIndices = Array.from({ length: mainState.strings.length }, (_, k) => k);
        if (mainState.isPlayerView) { stringIndices.reverse(); }

        stringIndices.forEach(stringIndex => {
            const freq = helpers.calculateFrettedFrequency(stringIndex, -1);
            const edoInfo = helpers.frequencyToEdoInfo(freq);
            const noteName = edoInfo.noteName;
            output += noteName.padEnd(4, ' ') + '|';
            for (let col = 0; col < tabState.numCols; col++) {
                let val = tabState.data[stringIndex][col];
                output += `-${val}-`.padEnd(4, '-');
            }
            output += '|\n';
        });
        dom.textTabIo.value = output;
    }

    /**
     * Imports a text tab from the text area, parsing it into the editor.
     */
    function importFromText() {
        stop();
        const text = dom.textTabIo.value;
        const lines = text.split('\n').filter(line => line.includes('|'));
        if (lines.length === 0) {
            alert("No valid tab lines found. Each line should contain a '|' character.");
            return;
        }

        let parsedLines = lines.map(line => line.substring(line.indexOf('|') + 1, line.lastIndexOf('|')).trim());
        const numStrings = parsedLines.length;

        if (numStrings !== mainState.strings.length) {
            alert(`Tab has ${numStrings} strings, but instrument has ${mainState.strings.length}. Please adjust the instrument first.`);
            return;
        }
        
        if (mainState.isPlayerView) { parsedLines.reverse(); }

        const charGrid = parsedLines.map(line => [...line]);
        const newTabData = Array.from({ length: numStrings }, () => []);
        let col = 0;
        const maxLength = Math.max(...charGrid.map(row => row.length));

        while (col < maxLength) {
            let advance = 1;
            let twoDigitStringIndex = -1;

            for (let str = 0; str < numStrings; str++) {
                const char = charGrid[str]?.[col];
                const nextChar = charGrid[str]?.[col + 1];
                if (char >= '0' && char <= '9' && nextChar >= '0' && nextChar <= '9') {
                    twoDigitStringIndex = str;
                    advance = 2;
                    break;
                }
            }

            for (let str = 0; str < numStrings; str++) {
                let val;
                if (twoDigitStringIndex !== -1) {
                    val = (str === twoDigitStringIndex) ? (charGrid[str][col] + charGrid[str][col + 1]) : (charGrid[str][col] || '-');
                } else {
                    val = charGrid[str]?.[col] || '-';
                }
                if (!"-hpx/\\~+0123456789".includes(val.toLowerCase())) val = '-';
                newTabData[str].push(val);
            }
            col += advance;
        }

        tabState.numCols = newTabData.length > 0 ? newTabData[0].length : 48;
        tabState.data = newTabData.map(row => {
            while (row.length < tabState.numCols) {
                row.push('-');
            }
            return row;
        });

        render();
    }

    /**
     * Exports the tab data to a downloadable MIDI file.
     */
    function exportToMidi() {
        const TPQN = 480;
        const STEPS_PER_QUARTER = 4;
        const TICKS_PER_STEP = TPQN / STEPS_PER_QUARTER;

        const writeString = s => s.split('').map(c => c.charCodeAt(0));
        const write_uint16 = n => [(n >> 8) & 0xFF, n & 0xFF];
        const write_uint32 = n => [(n >> 24) & 0xFF, (n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF];
        const writeVariableLength = n => { let buf = [], v = n; buf.push(v & 0x7F); v >>= 7; while (v > 0) { buf.push(0x80 | (v & 0x7F)); v >>= 7; } return buf.reverse(); };

        let trackEvents = [];
        for (let col = 0; col < tabState.numCols; col++) {
            const currentTime = col * TICKS_PER_STEP;
            for (let str = 0; str < mainState.strings.length; str++) {
                const fretVal = tabState.data[str][col];
                const fret = parseInt(fretVal, 10);
                if (!isNaN(fret) && fret >= 0 && fret <= mainState.frets) {
                    const fretIndex = (fret === 0) ? -1 : fret - 1;
                    const openStringMidi = helpers.frequencyToMidi(helpers.calculateFrettedFrequency(str, -1));
                    const midiNote = openStringMidi + (fretIndex + 1);
                    trackEvents.push({ time: currentTime, type: 0x90, channel: str, note: midiNote, velocity: 100 });
                    trackEvents.push({ time: currentTime + TICKS_PER_STEP, type: 0x80, channel: str, note: midiNote, velocity: 0 });
                }
            }
        }
        trackEvents.sort((a, b) => a.time - b.time || a.type - b.type);

        let finalMidiBytes = [], lastTime = 0;
        trackEvents.forEach(event => {
            const deltaTime = event.time - lastTime;
            finalMidiBytes.push(...writeVariableLength(deltaTime), event.type + event.channel, event.note, event.velocity);
            lastTime = event.time;
        });
        finalMidiBytes.push(...writeVariableLength(0), 0xFF, 0x2F, 0x00);

        const header = [...writeString('MThd'), ...write_uint32(6), ...write_uint16(1), ...write_uint16(1), ...write_uint16(TPQN)];
        const track = [...writeString('MTrk'), ...write_uint32(finalMidiBytes.length), ...finalMidiBytes];
        const blob = new Blob([new Uint8Array([...header, ...track])], { type: 'audio/midi' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'tablature.mid';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    /**
     * Handles the file input for importing a MIDI file.
     */
    function importFromMidi(e) {
        stop();
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const buffer = event.target.result;
                const dataView = new DataView(buffer);
                let ptr = 0;

                const readString = len => { let s = ''; for (let i = 0; i < len; i++) s += String.fromCharCode(dataView.getUint8(ptr++)); return s; };
                const readUint16 = () => { const v = dataView.getUint16(ptr); ptr += 2; return v; };
                const readUint32 = () => { const v = dataView.getUint32(ptr); ptr += 4; return v; };
                const readVarLen = () => { let v = 0, b; do { b = dataView.getUint8(ptr++); v = (v << 7) | (b & 0x7f); } while (b & 0x80); return v; };

                if (readString(4) !== 'MThd') throw new Error("Invalid MIDI header");
                readUint32();
                const numTracks = readUint16();
                const division = readUint16();

                const notes = [];
                for (let i = 0; i < numTracks; i++) {
                    if (readString(4) !== 'MTrk') continue;
                    let trackEnd = ptr + readUint32();
                    let absoluteTime = 0, lastStatus = 0;

                    while (ptr < trackEnd) {
                        absoluteTime += readVarLen();
                        let status = dataView.getUint8(ptr);
                        if (status < 0x80) { status = lastStatus; } else { ptr++; }
                        lastStatus = status;

                        const cmd = status >> 4;
                        if (cmd === 9) { // Note On
                            const note = dataView.getUint8(ptr++);
                            if (dataView.getUint8(ptr++) > 0) notes.push({ midi: note, time: absoluteTime });
                        } else if (cmd === 8) { ptr += 2; } // Note Off
                        else if (status === 0xFF) { ptr += 1 + readVarLen(); } // Meta Event
                        else if (status >= 0xC0 && status <= 0xDF) { ptr++; } // Program/Channel Pressure
                        else { ptr += 1; }
                    }
                }

                if (notes.length === 0) { alert("No notes found in MIDI file."); return; }

                const ticksPerStep = division / 4;
                const maxTime = Math.max(...notes.map(n => n.time));
                tabState.numCols = Math.ceil(maxTime / ticksPerStep) + 4;
                init();

                notes.forEach(note => {
                    const col = Math.round(note.time / ticksPerStep);
                    if (col < tabState.numCols) {
                        const location = helpers.findFirstAvailableNoteLocation(note.midi);
                        if (location && tabState.data[location.string][col] === '-') {
                            tabState.data[location.string][col] = (location.fret + 1).toString();
                        }
                    }
                });
                render();
            } catch (err) {
                console.error("Error parsing MIDI file:", err);
                alert("Could not parse MIDI file. It may be in an unsupported format.");
            }
        };
        reader.readAsArrayBuffer(file);
    }
    
    // --- PUBLIC INTERFACE ---

    /**
     * Initializes or resets the tablature data structure based on the current instrument settings.
     */
    function init() {
        tabState.data = [];
        for (let i = 0; i < mainState.strings.length; i++) {
            tabState.data.push(Array(tabState.numCols).fill('-'));
        }
    }

    /**
     * Handles keydown events, specifically looking for the Spacebar.
     * @param {KeyboardEvent} e The event object.
     * @returns {boolean} True if the event was handled, otherwise false.
     */
    function handleKeyDown(e) {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            if (tabState.isPlaying) {
                stop();
            } else {
                play();
            }
            return true; // Event was handled
        }
        return false; // Event was not handled
    }

    /**
     * Set up the module with dependencies from the main app.
     * @param {object} config Configuration object with state, dom, helpers, and audio.
     */
    function setup(config) {
        mainState = config.state;
        dom = config.dom;
        helpers = config.helpers;
        audio = config.audio;
        
        tabState.tempo = parseInt(dom.tempoInput.value, 10);

        // Attach event listeners
        dom.playTabBtn.addEventListener('click', play);
        dom.stopTabBtn.addEventListener('click', stop);
        dom.addTabColBtn.addEventListener('click', addColumn);
        dom.removeTabColBtn.addEventListener('click', removeColumn);
        dom.tempoInput.addEventListener('change', e => {
            tabState.tempo = parseInt(e.target.value, 10);
            if (tabState.isPlaying) {
                stop();
                play();
            }
        });
        dom.exportTextTabBtn.addEventListener('click', exportToText);
        dom.importTextTabBtn.addEventListener('click', importFromText);
        dom.exportMidiBtn.addEventListener('click', exportToMidi);
        dom.midiFileInput.addEventListener('change', importFromMidi);

        init();
    }

    return {
        setup: setup,
        init: init,
        render: render,
        stop: stop,
        handleKeyDown: handleKeyDown
    };
})();