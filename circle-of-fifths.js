const CircleOfFifths = (() => {
    // --- MODULE SCOPE VARIABLES ---
    // These will be populated by the init function
    let _state, _dom, _constants, _helpers, _handlers, _audio;

    // --- CONSTANTS MOVED FROM MAIN SCRIPT ---
    const COF_19_ORDER = [0, 11, 3, 14, 6, 17, 9, 1, 12, 4, 15, 7, 18, 10, 2, 13, 5, 16, 8];
    const COF_31_ORDER = [0, 18, 5, 23, 10, 28, 15, 2, 20, 7, 25, 12, 30, 17, 4, 22, 9, 27, 14, 1, 19, 6, 24, 11, 29, 16, 3, 21, 8, 26, 13];

    // --- EVENT HANDLERS ---
    function handleCofClick(e) {
        const group = e.currentTarget;
        const pitchClass = parseInt(group.dataset.pitchClass);
        const chordType = group.dataset.chordType || 'Major';

        if (_state.interactionMode === 'play') {
            const rootMidi = 60 + pitchClass;
            const chordSteps = _constants.CHORD_DEFINITIONS[chordType].steps;
            const chordIntervals = _helpers.chordStepsToAbsoluteIntervals(chordSteps);
            const frequencies = chordIntervals.map(interval => _helpers.midiToFrequency(rootMidi + interval));
            _audio.playSequence(frequencies);
            return;
        }

        if (!_state.isRootLocked) {
            // UNLOCKED: Change the root note and re-apply current scale/chord
            _dom.rootNoteSelect.value = pitchClass;
            if (_state.currentScale) {
                _handlers.handleShowScale();
            } else {
                _handlers.handleShowChord();
            }
        } else {
            // LOCKED: Explore chords within the current key
            const voicing = _helpers.findChordVoicing(pitchClass, chordType);
            _state.notes = voicing;
            _state.currentChord = { root: pitchClass, type: chordType, notes: voicing };
            const lockedRootName = _constants.NOTE_NAMES[parseInt(_dom.rootNoteSelect.value)];
            const clickedRootName = _constants.NOTE_NAMES[pitchClass];
            const chordSteps = _constants.CHORD_DEFINITIONS[chordType].steps;
            const chordIntervals = _helpers.chordStepsToAbsoluteIntervals(chordSteps);
            const chordNoteNames = chordIntervals.map(i => _constants.NOTE_NAMES[(pitchClass + i) % 12]).join(' · ');
            _dom.currentRootDisplay.textContent = `Key: ${lockedRootName} | Chord: ${clickedRootName} ${chordType}`;
            _dom.currentNotesDisplay.textContent = `Notes: ${chordNoteNames}`;
            _handlers.renderApp();
        }
    }

    function handleCof19Click(e) {
        const group = e.currentTarget;
        const pitchClass = parseInt(group.dataset.pitchClass);
        const chordType = group.dataset.chordType || 'Major (19)';

        if (_state.interactionMode === 'play') {
            const rootFreq = _helpers.getRootFrequency(); // Gets root based on dropdown
            const baseEdoInfo = _helpers.frequencyToEdoInfo(rootFreq);
            if (!baseEdoInfo) return; // Guard against no EDO info
            const clickedEdoInfo = { ...baseEdoInfo, stepInOctave: pitchClass };
            const rootAbsoluteStep = baseEdoInfo.absoluteStep;
            const clickedOffset = clickedEdoInfo.stepInOctave - baseEdoInfo.stepInOctave;

            const chordDef = _state.currentChordDefs[chordType];
            if (!chordDef) return; // Guard against no chord def
            const chordIntervals = _helpers.chordStepsToAbsoluteIntervals(chordDef.steps);
            const frequencies = chordIntervals.map(interval => {
                const edoStep = rootAbsoluteStep + clickedOffset + interval;
                return 16.351597831287414 * Math.pow(2, edoStep / 19);
            });
            _audio.playSequence(frequencies);
            return;
        }

        if (!_state.isRootLocked) {
             _dom.rootNoteSelect.value = pitchClass;
            if (_state.currentScale) {
                _handlers.handleShowScale();
            } else {
                _handlers.handleShowChord();
            }
        } else {
            const rootFrequency = _helpers.getRootFrequency();
            const chordDef = _state.currentChordDefs[chordType];
            if (!chordDef) return;
            const edoIntervals = _helpers.chordStepsToAbsoluteIntervals(chordDef.steps);
            const rootNoteEdoInfo = _helpers.frequencyToEdoInfo(rootFrequency);
            if (!rootNoteEdoInfo) return;
            
            const newRootAbsoluteStep = Math.floor(rootNoteEdoInfo.absoluteStep / 19) * 19 + pitchClass;
            const newRootFreq = 16.351597831287414 * Math.pow(2, newRootAbsoluteStep / 19);
            
            const voicing = _helpers.findEdoVoicing(newRootFreq, edoIntervals);
            
            _state.notes = voicing;
            _state.currentChord = { root: pitchClass, type: chordType, notes: voicing };
            
            const lockedRootName = _constants.EDO_SYSTEMS[19].names[parseInt(_dom.rootNoteSelect.value)];
            const clickedRootName = _constants.EDO_SYSTEMS[19].names[pitchClass];
            const chordNoteNames = edoIntervals.map(i => _constants.EDO_SYSTEMS[19].names[(pitchClass + i) % 19]).join(' · ');
            _dom.currentRootDisplay.textContent = `Key: ${lockedRootName} | Chord: ${clickedRootName} ${chordType}`;
            _dom.currentNotesDisplay.textContent = `Notes: ${chordNoteNames}`;
            _handlers.renderApp();
        }
    }

    function handleCof31Click(e) {
        const group = e.currentTarget;
        const pitchClass = parseInt(group.dataset.pitchClass);
        const chordType = group.dataset.chordType || 'Major (31)';

        if (_state.interactionMode === 'play') {
            const rootFreq = _helpers.getRootFrequency();
            const baseEdoInfo = _helpers.frequencyToEdoInfo(rootFreq);
            if (!baseEdoInfo) return;
            const clickedEdoInfo = { ...baseEdoInfo, stepInOctave: pitchClass };
            const rootAbsoluteStep = baseEdoInfo.absoluteStep;
            const clickedOffset = clickedEdoInfo.stepInOctave - baseEdoInfo.stepInOctave;

            const chordDef = _state.currentChordDefs[chordType];
            if (!chordDef) return;
            const chordIntervals = _helpers.chordStepsToAbsoluteIntervals(chordDef.steps);
            const frequencies = chordIntervals.map(interval => {
                const edoStep = rootAbsoluteStep + clickedOffset + interval;
                return 16.351597831287414 * Math.pow(2, edoStep / 31);
            });
            _audio.playSequence(frequencies);
            return;
        }
        
        if (!_state.isRootLocked) {
            _dom.rootNoteSelect.value = pitchClass;
            if (_state.currentScale) {
                _handlers.handleShowScale();
            } else {
                _handlers.handleShowChord();
            }
        } else {
            const rootFrequency = _helpers.getRootFrequency();
            const chordDef = _state.currentChordDefs[chordType];
            if (!chordDef) return;
            const edoIntervals = _helpers.chordStepsToAbsoluteIntervals(chordDef.steps);
            const rootNoteEdoInfo = _helpers.frequencyToEdoInfo(rootFrequency);
            if (!rootNoteEdoInfo) return;
            
            const newRootAbsoluteStep = Math.floor(rootNoteEdoInfo.absoluteStep / 31) * 31 + pitchClass;
            const newRootFreq = 16.351597831287414 * Math.pow(2, newRootAbsoluteStep / 31);
            
            const voicing = _helpers.findEdoVoicing(newRootFreq, edoIntervals);
            
            _state.notes = voicing;
            _state.currentChord = { root: pitchClass, type: chordType, notes: voicing };
            
            const lockedRootName = _constants.EDO_SYSTEMS[31].names[parseInt(_dom.rootNoteSelect.value)];
            const clickedRootName = _constants.EDO_SYSTEMS[31].names[pitchClass];
            const chordNoteNames = edoIntervals.map(i => _constants.EDO_SYSTEMS[31].names[(pitchClass + i) % 31]).join(' · ');
            _dom.currentRootDisplay.textContent = `Key: ${lockedRootName} | Chord: ${clickedRootName} ${chordType}`;
            _dom.currentNotesDisplay.textContent = `Notes: ${chordNoteNames}`;
            _handlers.renderApp();
        }
    }

    function handleLockToggle() {
        _state.isRootLocked = !_state.isRootLocked;
        updateLockVisuals();
        if (!_state.isRootLocked) {
             if (_state.currentScale) { _handlers.handleShowScale() } 
             else if (_state.currentChord) { _handlers.handleShowChord() }
        }
    }
    
    function updateLockVisuals() {
        const lockCircle12 = _dom.cofLockBtn.querySelector('circle');
        const lockCircle19 = _dom.cof19LockBtn.querySelector('circle');
        const lockCircle31 = _dom.cof31LockBtn.querySelector('circle');
        if (_state.isRootLocked) {
            lockCircle12.classList.add('locked');
            lockCircle19.classList.add('locked');
            lockCircle31.classList.add('locked');
            _dom.cofLockIcon.textContent = '🔒';
            _dom.cof19LockIcon.textContent = '🔒';
            _dom.cof31LockIcon.textContent = '🔒';
        } else {
            lockCircle12.classList.remove('locked');
            lockCircle19.classList.remove('locked');
            lockCircle31.classList.remove('locked');
            _dom.cofLockIcon.textContent = '🔓';
            _dom.cof19LockIcon.textContent = '🔓';
            _dom.cof31LockIcon.textContent = '🔓';
        }
    }

    // --- SVG CREATION FUNCTIONS ---
    function createCircleOfFifths() {
        const centerX = 150, centerY = 150, radius = 120;
        for (let i = 0; i < 12; i++) {
            const pitchClass = (i * 7) % 12;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('cof-note-group');
            group.setAttribute('data-pitch-class', pitchClass);
            group.id = `cof-note-${pitchClass}`;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 25);
            circle.classList.add('cof-note-circle');
            const noteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            noteText.setAttribute('x', x);
            noteText.setAttribute('y', y - 5);
            noteText.classList.add('cof-note-text');
            noteText.textContent = _constants.NOTE_NAMES[pitchClass];
            const romanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            romanText.setAttribute('x', x);
            romanText.setAttribute('y', y + 8);
            romanText.classList.add('cof-roman-text');

            // --- ADDED FOR RELATIVE MINOR ---
            const relativeMinorPitchClass = (pitchClass - 3 + 12) % 12;
            const minorText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            minorText.setAttribute('x', x);
            minorText.setAttribute('y', y + 15); // Position it below the major roman numeral
            minorText.classList.add('cof-minor-text');
            // REMOVED TO NOT SHOW RELATIVE MINOR --- minorText.textContent = `${_constants.NOTE_NAMES[relativeMinorPitchClass]}m`;
            // --- END RELATIVE MINOR ADDITION ---

            group.appendChild(circle);
            group.appendChild(noteText);
            group.appendChild(romanText);
            group.appendChild(minorText); // Append the new minor text element
            group.addEventListener('click', handleCofClick);
            _dom.cofSvg.insertBefore(group, _dom.cofLockBtn);
        }
    }

    function createCircleOfFifths19() {
        const centerX = 200, centerY = 200, radius = 170;
        const noteNames19 = _constants.EDO_SYSTEMS[19].names;

        for (let i = 0; i < 19; i++) {
            const pitchClass = COF_19_ORDER[i];
            const angle = (i * (360 / 19) - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('cof-note-group');
            group.setAttribute('data-pitch-class', pitchClass);
            group.id = `cof-19-note-${pitchClass}`;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 25);
            circle.classList.add('cof-note-circle');

            const noteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            noteText.setAttribute('x', x);
            noteText.setAttribute('y', y - 5);
            noteText.classList.add('cof-note-text');
            noteText.textContent = noteNames19[pitchClass];

            const romanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            romanText.setAttribute('x', x);
            romanText.setAttribute('y', y + 8);
            romanText.classList.add('cof-roman-text');

            group.appendChild(circle);
            group.appendChild(noteText);
            group.appendChild(romanText);
            group.addEventListener('click', handleCof19Click);
            _dom.cof19Svg.insertBefore(group, _dom.cof19LockBtn);
        }
    }

    function createCircleOfFifths31() {
        const centerX = 250, centerY = 250, radius = 220;
        const noteNames31 = _constants.EDO_SYSTEMS[31].names;

        for (let i = 0; i < 31; i++) {
            const pitchClass = COF_31_ORDER[i];
            const angle = (i * (360 / 31) - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('cof-note-group');
            group.setAttribute('data-pitch-class', pitchClass);
            group.id = `cof-31-note-${pitchClass}`;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 20);
            circle.classList.add('cof-note-circle');

            const noteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            noteText.setAttribute('x', x);
            noteText.setAttribute('y', y - 5);
            noteText.classList.add('cof-note-text');
            noteText.textContent = noteNames31[pitchClass];

            const romanText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            romanText.setAttribute('x', x);
            romanText.setAttribute('y', y + 8);
            romanText.classList.add('cof-roman-text');

            group.appendChild(circle);
            group.appendChild(noteText);
            group.appendChild(romanText);
            group.addEventListener('click', handleCof31Click);
            _dom.cof31Svg.insertBefore(group, _dom.cof31LockBtn);
        }
    }

    // --- PUBLIC METHODS ---
    function updateCircleOfFifths(rootNoteIndex, scaleName = 'Major (Ionian)') {
        if (_state.temperament !== 12) return;
        document.querySelectorAll('#cof-svg .cof-note-group').forEach(g => {
            g.querySelector('.cof-note-circle').classList.remove('highlight');
            g.querySelector('.cof-roman-text').textContent = '';
        });
        if (rootNoteIndex === null || rootNoteIndex === undefined) return;

        const scaleIntervals = _state.currentScaleDefs[scaleName] || [];
        const isHeptatonic = scaleIntervals.length === 7;
        const diatonicChords = scaleName.includes('Minor') ? _constants.MINOR_SCALE_DIATONIC_CHORDS : _constants.MAJOR_SCALE_DIATONIC_CHORDS;
        
        scaleIntervals.forEach((interval, i) => {
            const notePitchClass = (rootNoteIndex + interval) % 12;
            const group = document.getElementById(`cof-note-${notePitchClass}`);
            if (group) {
                group.querySelector('.cof-note-circle').classList.add('highlight');
                if (isHeptatonic) {
                    const romanText = group.querySelector('.cof-roman-text');
                    romanText.textContent = diatonicChords[i].roman;
                    group.dataset.chordType = diatonicChords[i].type;
                }
            }
        });
    }
    
    function updateCircleOfFifths19(rootNoteIndex, scaleName) {
        if (_state.temperament !== 19) return;
        
        document.querySelectorAll('#cof-19-svg .cof-note-group').forEach(g => {
            g.querySelector('.cof-note-circle').classList.remove('highlight');
            g.querySelector('.cof-roman-text').textContent = '';
            g.dataset.chordType = ''; // Clear chord type as well
        });

        if (rootNoteIndex === null || rootNoteIndex === undefined || !scaleName) return;

        const scaleIntervals = _state.currentScaleDefs[scaleName] || [];
        const isHeptatonic = scaleIntervals.length === 7;

        scaleIntervals.forEach((interval, i) => {
            const notePitchClass = (rootNoteIndex + interval) % 19;
            const group = document.getElementById(`cof-19-note-${notePitchClass}`);
            if (group) {
                group.querySelector('.cof-note-circle').classList.add('highlight');
                const romanText = group.querySelector('.cof-roman-text');

                if (isHeptatonic) {
                    romanText.textContent = _constants.DIATONIC_CHORDS_19[i].roman;
                    group.dataset.chordType = _constants.DIATONIC_CHORDS_19[i].type;
                } else {
                    romanText.textContent = `${i + 1}`;
                    group.dataset.chordType = 'Major (19)'; 
                }
            }
        });
    }

    function updateCircleOfFifths31(rootNoteIndex, scaleName) {
        if (_state.temperament !== 31) return;
        
        document.querySelectorAll('#cof-31-svg .cof-note-group').forEach(g => {
            g.querySelector('.cof-note-circle').classList.remove('highlight');
            g.querySelector('.cof-roman-text').textContent = '';
            g.dataset.chordType = '';
        });

        if (rootNoteIndex === null || rootNoteIndex === undefined || !scaleName) return;

        const scaleIntervals = _state.currentScaleDefs[scaleName] || [];
        const isHeptatonic = scaleIntervals.length === 7;

        scaleIntervals.forEach((interval, i) => {
            const notePitchClass = (rootNoteIndex + interval) % 31;
            const group = document.getElementById(`cof-31-note-${notePitchClass}`);
            if (group) {
                group.querySelector('.cof-note-circle').classList.add('highlight');
                const romanText = group.querySelector('.cof-roman-text');

                if (isHeptatonic) {
                    romanText.textContent = _constants.DIATONIC_CHORDS_31[i].roman;
                    group.dataset.chordType = _constants.DIATONIC_CHORDS_31[i].type;
                } else {
                    romanText.textContent = `${i + 1}`;
                    group.dataset.chordType = 'Major (31)'; 
                }
            }
        });
    }

    function init(dependencies) {
        // Store all dependencies passed from main-app.js
        _state = dependencies.state;
        _dom = dependencies.dom;
        _constants = dependencies.constants;
        _helpers = dependencies.helpers;
        _handlers = dependencies.handlers;
        _audio = dependencies.audio;

        // Create the SVG content
        createCircleOfFifths();
        createCircleOfFifths19();
        createCircleOfFifths31();
        
        // Set the initial visual state of the lock based on the default state
        updateLockVisuals();

        // Attach event listeners for the lock buttons
        _dom.cofLockBtn.addEventListener('click', handleLockToggle);
        _dom.cof19LockBtn.addEventListener('click', handleLockToggle);
        _dom.cof31LockBtn.addEventListener('click', handleLockToggle);
    }

    // --- PUBLIC INTERFACE ---
    return {
        init,
        updateCircleOfFifths,
        updateCircleOfFifths19,
        updateCircleOfFifths31
    };
})();
