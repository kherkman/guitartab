document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTS ---
    const MIN_STRINGS = 1, MAX_STRINGS = 12, MIN_FRETS = 0, MAX_FRETS = 36;
    const STEEL_DENSITY_KG_M3 = 7850, LBS_TO_NEWTONS = 4.44822, INCH_TO_METER = 0.0254;
    const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const GUITAR_TUNING_HZ = [82.41,110.00,146.83,196.00,246.94,329.63], GUITAR_GAUGES = [0.042,0.032,0.024,0.016,0.011,0.009];
    const BASS_TUNING_HZ = [41.20,55.00,73.42,98.00], BASS_GAUGES = [0.105,0.085,0.065,0.045];
    const UKULELE_TUNING_HZ = [392.00,261.63,329.63,440.00], UKULELE_GAUGES = [0.028,0.040,0.032,0.022];
    const DROP_D_TUNING_HZ = [73.42,110.00,146.83,196.00,246.94,329.63], DROP_D_GAUGES = GUITAR_GAUGES;
    const OPEN_G_TUNING_HZ = [73.42,98.00,146.83,196.00,246.94,293.66], OPEN_G_GAUGES = [0.046,0.036,0.026,0.017,0.013,0.010];
    const DADGAD_TUNING_HZ = [73.42,110.00,146.83,196.00,220.00,293.66], DADGAD_GAUGES = [0.056,0.042,0.032,0.024,0.016,0.012];
    const SEVEN_STRING_TUNING_HZ = [61.74, ...GUITAR_TUNING_HZ], SEVEN_STRING_GAUGES = [0.059, ...GUITAR_GAUGES];
    const EIGHT_STRING_TUNING_HZ = [46.25, ...SEVEN_STRING_TUNING_HZ], EIGHT_STRING_GAUGES = [0.074, ...SEVEN_STRING_GAUGES];
    const KANTELE_5_MAJOR_HZ = [196.00, 220.00, 246.94, 261.63, 293.66], KANTELE_5_GAUGES = [0.018, 0.016, 0.014, 0.013, 0.011];
    const KANTELE_5_MINOR_HZ = [220.00, 246.94, 261.63, 293.66, 329.63], KANTELE_5_MINOR_GAUGES = KANTELE_5_GAUGES;
    const KANTELE_11_HZ = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], KANTELE_11_GAUGES = [0.022, 0.020, 0.018, 0.016, 0.014, 0.012, 0.011, 0.010, 0.009, 0.008, 0.007];
    const JUST_INTONATION_RATIOS = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
    const TRUE_TEMPERAMENT_OFFSETS_CENTS = [ [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, +12, +14, +12, +14, +12, +10, +14, +16, +14, +12, +14], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0] ];
    const CHORD_DEFINITIONS = { 'Major': {steps:[4,3]},'Minor': {steps:[3,4]},'Diminished': {steps:[3,3]},'Augmented': {steps:[4,4]},'Dominant 7th': {steps:[4,3,3]},'Major 7th': {steps:[4,3,4]},'Minor 7th': {steps:[3,4,3]},'Major 6th': {steps:[4,3,2]},'Minor 6th': {steps:[3,4,2]}, 'Suspended 2nd': {steps:[2,5]},'Suspended 4th': {steps:[5,2]},'Major 9th': {steps:[4,3,4,3]},'Dominant 9th': {steps:[4,3,3,4]},'Minor 9th': {steps:[3,4,3,4]},'11th':{steps:[4,3,3,7]},'Dominant 13th':{steps:[4,3,3,4,7]},'Major 13th':{steps:[4,3,4,3,7]},'Minor 13th':{steps:[3,4,3,4,7]} };
    const CHORD_DEFINITIONS_19 = { 'Major (19)': { steps: [6, 5] }, 'Minor (19)': { steps: [5, 6] }, 'Diminished (19)': { steps: [5, 5] }, 'Subminor (19)': { steps: [4, 7] }, 'Supermajor (19)': { steps: [7, 4] }, 'Diminished Seventh (19)': { steps: [5, 5, 5] } };
    const CHORD_DEFINITIONS_24 = { 'Neutral (24)': { steps: [7, 7] } };
    const CHORD_DEFINITIONS_31 = { 'Major (31)': { steps: [10, 8] }, 'minor (31)': { steps: [8, 10] }, 'Diminished (31)': { steps: [8, 8] }, 'Neutral (31)': { steps: [9, 9] }, 'Barbershop Seventh (31)': { steps: [10, 8, 7] }, 'I Supermajor Minor Seven (31)': { steps: [11, 7, 7] }, 'Septimal 11th (31)': { steps: [10, 5, 3, 7] }, 'Undecimal 11th (31)': { steps: [10, 4, 4, 7] }, 'Neutral Harmonic Seventh (31)': { steps: [9, 9, 7] }, 'Neutral Minor Seventh (31)': { steps: [9, 9, 8] }, 'Neutral Major Seventh (31)': { steps: [9, 9, 10] } };
    
    const INTERVAL_NAMES = {0:'R',1:'b2',2:'2',3:'b3',4:'3',5:'4',6:'b5',7:'5',8:'#5',9:'6',10:'b7',11:'7',12:'R',13:'b9',14:'9',15:'#9',16:'b11',17:'11',18:'#11',19:'b13',20:'6',21:'13'};
    const ROMAN_INTERVAL_NAMES = {0:'I',1:'bII',2:'II',3:'bIII',4:'III',5:'IV',6:'bV',7:'V',8:'#V',9:'VI',10:'bVII',11:'VII'};
    const DIATONIC_DEGREES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const DIATONIC_MODE_NAMES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
    const MAJOR_SCALE_DIATONIC_CHORDS = [ {type: 'Major', roman: 'I'}, {type: 'Minor', roman: 'ii'}, {type: 'Minor', roman: 'iii'}, {type: 'Major', roman: 'IV'}, {type: 'Major', roman: 'V'}, {type: 'Minor', roman: 'vi'}, {type: 'Diminished', roman: 'vii°'} ];
    const MINOR_SCALE_DIATONIC_CHORDS = [ {type: 'Minor', roman: 'i'}, {type: 'Diminished', roman: 'ii°'}, {type: 'Major', roman: 'bIII'}, {type: 'Minor', roman: 'iv'}, {type: 'Minor', roman: 'v'}, {type: 'Major', roman: 'bVI'}, {type: 'Major', roman: 'bVII'} ];
    const DIATONIC_CHORDS_19 = [ {type: 'Minor (19)', roman: 'i'}, {type: 'Diminished (19)', roman: 'ii°'}, {type: 'Major (19)', roman: '♭III'}, {type: 'Minor (19)', roman: 'iv'}, {type: 'Minor (19)', roman: 'v'}, {type: 'Major (19)', roman: '♭VI'}, {type: 'Major (19)', roman: '♭VII'} ];
    const DIATONIC_CHORDS_31 = [ {type: 'Major (31)', roman: 'I'}, {type: 'minor (31)', roman: 'ii'}, {type: 'minor (31)', roman: 'iii'}, {type: 'Major (31)', roman: 'IV'}, {type: 'Major (31)', roman: 'V'}, {type: 'minor (31)', roman: 'vi'}, {type: 'Diminished (31)', roman: 'vii°'} ];
    const EDO_SYSTEMS = {
        19: {
            names: ["C", "C♯", "D♭", "D", "D♯", "E♭", "F♭", "E", "F", "F♯", "G♭", "G", "G♯", "A♭", "A", "A♯", "B♭", "C♭", "B"],
            intervals: ["R", "A1", "m2", "N2", "M2", "A2", "d3", "m3", "M3", "d4", "P4", "A4", "d5", "P5", "m6", "M6", "m7", "d8", "M7"]
        },
        24: {
            names: ["C", "Cq♯", "C♯", "Dq♭", "D", "Dq♯", "D♯", "Eq♭", "E", "Fq♭", "F", "Fq♯", "F♯", "Gq♭", "G", "Gq♯", "G♯", "Aq♭", "A", "Aq♯", "A♯", "Bq♭", "B", "Cq♭"],
            intervals: ["R", "qA1", "m2", "qN2", "M2", "qA2", "d3", "qm3", "m3", "qM3", "M3", "qd4", "P4", "qA4", "A4", "qd5", "d5", "qP5", "P5", "qA5", "A5", "qm7", "m7", "qM7"]
        },
        31: {
            names: ["C", "C↑", "C♯", "D♭", "D↓", "D", "D↑", "D♯", "E♭", "E↓", "F♭", "E", "E↑", "F", "F↑", "F♯", "G♭", "G↓", "G", "G↑", "G♯", "A♭", "A↓", "A", "A↑", "A♯", "B♭", "B↓", "C♭", "B", "B↑"],
            intervals: ["R", "↑1", "m2", "M2-", "↓2", "M2", "↑2", "m3", "M3-", "↓3", "d4", "M3", "↑3", "P4", "↑4", "A4", "d5", "↓5", "P5", "↑5", "m6", "M6-", "↓6", "M6", "↑6", "m7", "M7-", "↓7", "d8", "M7", "↑7"]
        }
    };
    
    const ZEITLER_SCALE_DEFINITIONS = {};
    let ALL_SCALE_DEFINITIONS_FOR_RECOGNITION = {};

    // --- STATE ---
    let state = { 
        strings: [], frets: 12, notes: [], highlightedNotes: [], fretPositions: [], currentChord: null, currentScale: null, tuningPanelVisible: false, noteDisplayMode: 'names', notesPerStringLimit: 'all', showFretNumbers: true, isRootLocked: true, isPlayerView: true, isLeftHanded: false, interactionMode: 'toggle_note', midiAccess: null, midiInputs: [], midiOutputs: [], selectedMidiInId: null, selectedMidiOutId: null, activeMidiNotes: new Map(),
        masterVolume: 0.8,
        temperament: 12,
        currentChordDefs: {},
        currentScaleDefs: {},
        scaleStepsToNameMap: new Map(),
        isZeitlerMode: false,
        instrumentMode: null, overtoneFundamentalHz: null,
        showingAlternativeVoicing: false,
        intervalColors: { 'R': '#FF4136', 'b2': '#FF851B', '2': '#FFDC00', 'b3': '#01FF70', '3': '#2ECC40', '4': '#3D9970', 'b5': '#39CCCC', '5': '#7FDBFF', '#5': '#0074D9', '6': '#B10DC9', 'b7': '#F012BE', '7': '#85144b'}
    };

    // --- DOM ELEMENTS ---
    const mainLayout = document.getElementById('main-layout'), stringControlsContainer = document.getElementById('string-controls-container'), fretboardWrapper = document.getElementById('fretboard-wrapper'), fretboardContainer = document.getElementById('fretboard-container'), fretNumbersContainer = document.getElementById('fret-numbers-container');
    const zoomSlider = document.getElementById('zoom-slider');
    const masterVolumeSlider = document.getElementById('master-volume-slider');
    const overtoneComments = document.getElementById('overtone-comments');
    const zeitlerCredit = document.getElementById('zeitler-credit');
    const comments19Edo = document.getElementById('comments-19-edo');
    const comments24Edo = document.getElementById('comments-24-edo');
    const comments31Edo = document.getElementById('comments-31-edo');
    const fretCountEl = document.getElementById('fret-count');
    const addLowStringBtn = document.getElementById('add-low-string'), addHighStringBtn = document.getElementById('add-high-string');
    const addFretBtn = document.getElementById('add-fret'), removeFretBtn = document.getElementById('remove-fret');
    const rootNoteSelect = document.getElementById('root-note-select'), chordTypeSelect = document.getElementById('chord-type-select'), showChordBtn = document.getElementById('show-chord-btn'), clearFretboardBtn = document.getElementById('clear-fretboard-btn');
    const playStrumBtn = document.getElementById('play-strum-btn'), playShredBtn = document.getElementById('play-shred-btn');
    const recognizedChordDisplay = document.getElementById('recognized-chord-display'), recognizedScaleDisplay = document.getElementById('recognized-scale-display');
    const diatonicChordsContainer = document.getElementById('diatonic-chords-container');
    const currentRootDisplay = document.getElementById('current-root-display'), currentNotesDisplay = document.getElementById('current-notes-display');
    const currentNotesSimpleDisplay = document.getElementById('current-notes-simple-display');
    const currentIntervalsContainer = document.getElementById('current-intervals-container');
    const currentIntervalsDisplay = document.getElementById('current-intervals-display');
    const scaleTypeSelect = document.getElementById('scale-type-select'), showScaleBtn = document.getElementById('show-scale-btn'), randomScaleBtn = document.getElementById('random-scale-btn'), notesPerStringSelect = document.getElementById('notes-per-string-select');
    const scaleSearchInput = document.getElementById('scale-search-input');
    const resetFretsBtn = document.getElementById('reset-frets'), toggleTuningBtn = document.getElementById('toggle-tuning-panel'), displayModeSelect = document.getElementById('display-mode'), setupSelect = document.getElementById('setup-select');
    const showFretNumbersBtn = document.getElementById('show-fret-numbers-btn'), showAllNotesBtn = document.getElementById('show-all-notes-btn'), reverseStringsBtn = document.getElementById('reverse-strings-btn'), leftHandedBtn = document.getElementById('left-handed-btn'), editPlayModeSelect = document.getElementById('edit-play-mode');
    const soundTypeSelect = document.getElementById('sound-type-select');
    const toggleScaleSetBtn = document.getElementById('toggle-scale-set-btn');
    const midiInSelect = document.getElementById('midi-in-select'), midiOutSelect = document.getElementById('midi-out-select');
    const cofSvg = document.getElementById('cof-svg'), cofLockBtn = document.getElementById('cof-lock-btn'), cofLockIcon = document.getElementById('cof-lock-icon');
    const cof19Container = document.getElementById('circle-of-fifths-19-container');
    const cof19Svg = document.getElementById('cof-19-svg'), cof19LockBtn = document.getElementById('cof-19-lock-btn'), cof19LockIcon = document.getElementById('cof-19-lock-icon');
    const cof31Container = document.getElementById('circle-of-fifths-31-container');
    const cof31Svg = document.getElementById('cof-31-svg'), cof31LockBtn = document.getElementById('cof-31-lock-btn'), cof31LockIcon = document.getElementById('cof-31-lock-icon');
    const scaleModesContainer = document.getElementById('scale-modes-container'), scaleModesList = document.getElementById('scale-modes-list');
    const alternativeVoicingContainer = document.getElementById('alternative-voicing-container'), alternativeVoicingBtn = document.getElementById('alternative-voicing-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn'), screenshotBtn = document.getElementById('screenshot-btn');
    const intervalColorControls = document.getElementById('interval-color-controls');
    // Tab DOM elements
    const tabGrid = document.getElementById('tab-grid'), tabPlayhead = document.getElementById('tab-playhead'), tempoInput = document.getElementById('tempo-input'), textTabIo = document.getElementById('text-tab-io'), midiFileInput = document.getElementById('midi-file-input');
    const playTabBtn = document.getElementById('play-tab-btn'), stopTabBtn = document.getElementById('stop-tab-btn'), addTabColBtn = document.getElementById('add-tab-col-btn'), removeTabColBtn = document.getElementById('remove-tab-col-btn');
    const importTextTabBtn = document.getElementById('import-text-tab-btn'), exportTextTabBtn = document.getElementById('export-text-tab-btn'), exportMidiBtn = document.getElementById('export-midi-btn');

    // --- HELPER, PHYSICS & CHORD/SCALE FUNCTIONS ---
    function getRootFrequency(octave = 3) { if (!rootNoteSelect.value) return 0; const C0_HZ = 16.351597831287414; const rootStepInOctave = parseInt(rootNoteSelect.value, 10); const edo = state.temperament || 12; const absoluteStep = octave * edo + rootStepInOctave; return C0_HZ * Math.pow(2, absoluteStep / edo); }
    function stepsToIntervals(steps) { const intervals = [0]; let currentSemitone = 0; for (let i = 0; i < steps.length - 1; i++) { currentSemitone += parseInt(steps[i], 10); intervals.push(currentSemitone); } return intervals; }
    function chordStepsToAbsoluteIntervals(steps) { if (!steps) return [0]; const intervals = [0]; let currentSemitone = 0; for (const step of steps) { currentSemitone += parseInt(step, 10); intervals.push(currentSemitone); } return intervals; }
    function getVisualThickness(gauge) { const minGauge = 0.007, maxGauge = 0.110, minPx = 1.0, maxPx = 7.0; const clampedGauge = Math.max(minGauge, Math.min(gauge, maxGauge)); const gaugeRange = maxGauge - minGauge, pxRange = maxPx - minPx; return minPx + ((clampedGauge - minGauge) / gaugeRange) * pxRange; }
    function calculateFrequency(string) { if (!string || string.length <= 0 || string.width <= 0 || string.tension <= 0) return 0; const length_m = string.length * INCH_TO_METER, width_m = string.width * INCH_TO_METER, tension_N = string.tension * LBS_TO_NEWTONS; const radius_m = width_m / 2, area_m2 = Math.PI * Math.pow(radius_m, 2), linearDensity_mu = STEEL_DENSITY_KG_M3 * area_m2; return (1 / (2 * length_m)) * Math.sqrt(tension_N / linearDensity_mu); }
    function calculateLength(tension, width, frequency) { if(frequency <= 0) return 0; const width_m = width * INCH_TO_METER; const radius_m = width_m / 2; const area_m2 = Math.PI * Math.pow(radius_m, 2); const linearDensity_mu = STEEL_DENSITY_KG_M3 * area_m2; const tension_N = tension * LBS_TO_NEWTONS; const length_m = (1 / (2 * frequency)) * Math.sqrt(tension_N / linearDensity_mu); return length_m / INCH_TO_METER; }
    function calculateTension(string, targetFrequency) { if (!string || string.length <= 0 || string.width <= 0 || targetFrequency <= 0) return 0; const length_m = string.length * INCH_TO_METER, width_m = string.width * INCH_TO_METER; const radius_m = width_m / 2, area_m2 = Math.PI * Math.pow(radius_m, 2), linearDensity_mu = STEEL_DENSITY_KG_M3 * area_m2; const tension_N = linearDensity_mu * Math.pow(targetFrequency * 2 * length_m, 2); return tension_N / LBS_TO_NEWTONS; }
    function calculateFrettedFrequency(stringIndex, fretIndex) { if(fretIndex >= state.frets) return 0; const string = state.strings[stringIndex]; if (fretIndex === -1) return calculateFrequency(string); const fretDividerPosition = state.fretPositions[stringIndex][fretIndex + 1]; const lengthRatio = (100 - fretDividerPosition) / 100; const frettedLength = string.length * lengthRatio; return calculateFrequency({ ...string, length: frettedLength }); }
    function createStringWithTuning(freq, gauge) { const tempString = { length: 24.0, width: gauge }; return { ...tempString, tension: calculateTension(tempString, freq) }; }
    function midiToFrequency(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
    function frequencyToMidi(frequency) { return Math.round(69 + 12 * Math.log2(frequency / 440.0)); }
    function frequencyToEdoInfo(frequency) {
        if (!frequency || frequency <= 0) return null;

        const edo = state.temperament || 12;
        
        if (edo === 12) {
            const midi = frequencyToMidi(frequency);
            return {
                midi: midi,
                absoluteStep: midi,
                octave: Math.floor(midi / 12) - 1,
                stepInOctave: midi % 12,
                noteName: NOTE_NAMES[midi % 12]
            };
        }
        const C0_HZ = 16.351597831287414;
        const absoluteStep = Math.round(edo * Math.log2(frequency / C0_HZ));
        const octave = Math.floor(absoluteStep / edo);
        const stepInOctave = absoluteStep % edo;
        const edoData = EDO_SYSTEMS[edo] || {};
        const noteName = (edoData.names && edoData.names[stepInOctave]) ? edoData.names[stepInOctave] : `S:${stepInOctave}`;
        return { absoluteStep, octave, stepInOctave, noteName };
    }
    function frequencyToNoteName(frequency) { if (frequency <= 0) return "N/A"; const midiNoteNumber = frequencyToMidi(frequency); return `${NOTE_NAMES[midiNoteNumber % 12]}`; }
    function generateInitialFretPositions(temperament = 12) {
        state.fretPositions = [];
        for (let i = 0; i < state.strings.length; i++) {
            const stringFrets = [0];
            if (temperament === 'just') {
                for (let j = 0; j < state.frets; j++) {
                    const ratio = JUST_INTONATION_RATIOS[j % 12] * Math.pow(2, Math.floor(j / 12));
                    stringFrets.push((1 - (1 / ratio)) * 100);
                }
            } else if (temperament === 'true_temperament' && i < TRUE_TEMPERAMENT_OFFSETS_CENTS.length) {
                const twelfthRootOfTwo = Math.pow(2, 1/12);
                for (let j = 0; j < state.frets; j++) {
                    const et_ratio = Math.pow(twelfthRootOfTwo, j + 1);
                    const cents_offset = (TRUE_TEMPERAMENT_OFFSETS_CENTS[i][j % 12] || 0);
                    const final_ratio = et_ratio * Math.pow(2, cents_offset / 1200);
                    stringFrets.push((1 - (1 / final_ratio)) * 100);
                }
            } else if (typeof temperament === 'number') { // Handles all EDOs (12, 19, 24, 31, etc.)
                const stepRatio = Math.pow(2, 1 / temperament);
                let remainingLength = 100;
                for (let j = 0; j < state.frets; j++) {
                    stringFrets.push(100 - (remainingLength / stepRatio));
                    remainingLength /= stepRatio;
                }
            }
            stringFrets.push(100);
            state.fretPositions.push(stringFrets);
        }
    }
    function findChordVoicing(rootNoteIndex, chordType, useAlternative = false) {
        const rootNoteName = NOTE_NAMES[rootNoteIndex];
        const library = useAlternative ? ALTERNATIVE_VOICING_LIBRARY : VOICING_LIBRARY;

        if (state.strings.length === 6 && library[rootNoteName] && library[rootNoteName][chordType]) {
            const pattern = library[rootNoteName][chordType];
            return pattern.map((voiceData, stringIndex) => ({ string: stringIndex, fret: voiceData.fret, finger: voiceData.finger }));
        }

        // Only do procedural fallback for the standard library if no library voicing was found
        if (!useAlternative) {
            const chordSteps = (state.currentChordDefs[chordType] || {steps:[]}).steps;
            const chordIntervals = chordStepsToAbsoluteIntervals(chordSteps);
            const chordNoteIndexes = chordIntervals.map(i => (rootNoteIndex + i) % 12);
            let voicing = [];
            for (let i = 0; i < state.strings.length; i++) {
                const openStringMidi = frequencyToMidi(calculateFrequency(state.strings[i]));
                let bestFret = null;
                for (let fret = -1; fret < state.frets; fret++) {
                    const currentNoteMidi = openStringMidi + (fret + 1);
                    const currentNoteIndex = currentNoteMidi % 12;
                    if (chordNoteIndexes.includes(currentNoteIndex)) {
                        bestFret = fret;
                        break;
                    }
                }
                voicing.push({ string: i, fret: bestFret });
            }
            return voicing;
        }
        
        return null; // Return null if looking for an alternative that doesn't exist in the library
    }
    function recognizeChord(notes) { if (notes.length < 3) return null; const pitchClasses = [...new Set(notes.map(n => frequencyToMidi(calculateFrettedFrequency(n.string, n.fret)) % 12))].sort((a, b) => a - b); if (pitchClasses.length < 2) return null; for (const potentialRoot of pitchClasses) { const intervals = pitchClasses.map(pc => (pc - potentialRoot + 12) % 12).sort((a,b) => a - b); for (const chordName in CHORD_DEFINITIONS) { const defSteps = CHORD_DEFINITIONS[chordName].steps; const defIntervals = chordStepsToAbsoluteIntervals(defSteps); if (intervals.length === defIntervals.length && intervals.every((val, index) => val === defIntervals[index])) { return { root: NOTE_NAMES[potentialRoot], type: chordName, rootIndex: potentialRoot }; } } } return null; }
    function recognizeScale(notes) { const pitchClasses = [...new Set(notes.map(n => frequencyToMidi(calculateFrettedFrequency(n.string, n.fret)) % 12))].sort((a, b) => a - b); if (pitchClasses.length < 5) return null; for (const potentialRoot of pitchClasses) { const intervals = pitchClasses.map(pc => (pc - potentialRoot + 12) % 12).sort((a,b) => a - b); for (const scaleName in ALL_SCALE_DEFINITIONS_FOR_RECOGNITION) { const defIntervals = ALL_SCALE_DEFINITIONS_FOR_RECOGNITION[scaleName]; if (intervals.length === defIntervals.length && intervals.every((val, index) => val === defIntervals[index])) { return { root: NOTE_NAMES[potentialRoot], type: scaleName, rootIndex: potentialRoot }; } } } return null; }

    function findFirstAvailableNoteLocation(midiNote) {
        for (let i = state.strings.length - 1; i >= 0; i--) {
            const openStringMidi = frequencyToMidi(calculateFrequency(state.strings[i]));
            const fret = midiNote - openStringMidi;
            if (fret >= 0 && fret < state.frets) {
                return { string: i, fret: fret };
            }
        }
        return null;
    }

    // --- RENDER & UI FUNCTIONS ---
    function renderApp() {
        if (state.tuningPanelVisible) { stringControlsContainer.style.display = 'flex'; mainLayout.style.gridTemplateColumns = '460px 1fr'; } else { stringControlsContainer.style.display = 'none'; mainLayout.style.gridTemplateColumns = '1fr'; }
        toggleTuningBtn.textContent = state.tuningPanelVisible ? 'Hide Tuning' : 'Show Tuning';
        if (state.isLeftHanded) fretboardWrapper.classList.add('left-handed'); else fretboardWrapper.classList.remove('left-handed');
        
        overtoneComments.style.display = (state.instrumentMode === 'overtone') ? 'block' : 'none';
        comments19Edo.style.display = (state.temperament === 19) ? 'block' : 'none';
        comments24Edo.style.display = (state.temperament === 24) ? 'block' : 'none';
        comments31Edo.style.display = (state.temperament === 31) ? 'block' : 'none';

        const isManualMode = !state.currentChord && !state.currentScale;
        const recognizedChord = (isManualMode && state.temperament === 12) ? recognizeChord(state.notes) : null;
        const recognizedScale = (isManualMode && !recognizedChord && state.temperament === 12) ? recognizeScale(state.notes) : null;

        recognizedChordDisplay.textContent = '';
        recognizedChordDisplay.classList.remove('clickable');
        recognizedChordDisplay.removeAttribute('data-root-index');
        recognizedChordDisplay.removeAttribute('data-type');
        
        if (state.temperament !== 12) {
            recognizedChordDisplay.textContent = 'Recognition disabled for non-12-EDO tunings.';
            recognizedScaleDisplay.textContent = '';
        } else if (recognizedChord) {
            recognizedChordDisplay.textContent = `Recognized: ${recognizedChord.root} ${recognizedChord.type}`;
            recognizedChordDisplay.classList.add('clickable');
            recognizedChordDisplay.dataset.rootIndex = recognizedChord.rootIndex;
            recognizedChordDisplay.dataset.type = recognizedChord.type;
        }
        
        recognizedScaleDisplay.textContent = '';
        recognizedScaleDisplay.classList.remove('clickable');
        recognizedScaleDisplay.removeAttribute('data-root-index');
        recognizedScaleDisplay.removeAttribute('data-type');

        if (recognizedScale) {
            recognizedScaleDisplay.textContent = `Recognized: ${recognizedScale.root} ${recognizedScale.type}`;
            recognizedScaleDisplay.classList.add('clickable');
            recognizedScaleDisplay.dataset.rootIndex = recognizedScale.rootIndex;
            recognizedScaleDisplay.dataset.type = recognizedScale.type;
        }
        
        let simpleNotesText = '';
        if (isManualMode && state.notes.length > 0) {
            const uniqueNoteNames = [...new Set(state.notes.map(note => {
                const freq = calculateFrettedFrequency(note.string, note.fret);
                const edoInfo = frequencyToEdoInfo(freq);
                return edoInfo ? edoInfo.noteName : null;
            }).filter(name => name !== null))].sort();

            if (uniqueNoteNames.length > 0) {
                simpleNotesText = `Selected Notes: ${uniqueNoteNames.join(' · ')}`;
            }
        }
        currentNotesSimpleDisplay.textContent = simpleNotesText;

        cofSvg.parentElement.style.display = state.temperament === 12 ? 'flex' : 'none';
        cof19Container.style.display = state.temperament === 19 ? 'flex' : 'none';
        cof31Container.style.display = state.temperament === 31 ? 'flex' : 'none';
        scaleModesContainer.style.display = state.currentScale ? 'flex' : 'none';

        stringControlsContainer.innerHTML = ''; fretboardContainer.innerHTML = ''; fretNumbersContainer.innerHTML = '';
        
        // Determine render order based on Player vs Spectator view
        const stringIndices = Array.from({ length: state.strings.length }, (_, k) => k);
        const renderOrder = state.isPlayerView ? [...stringIndices].reverse() : stringIndices;

        // Render controls and strings in the determined order
        renderOrder.forEach(i => {
            if(state.tuningPanelVisible) renderStringControlPanel(state.strings[i], i);
        });
        if(state.showFretNumbers && state.frets > 0) renderFretNumbers();
        renderOrder.forEach(i => renderStringRow(state.strings[i], i));
        
        TabEditor.render();
        updateGlobalControls(); 
        updateFretboardModeClass();
        attachEventListeners();
    }
    function renderStringControlPanel(string, index) {
        const panel = document.createElement('div'); panel.className = 'string-control-panel';
        if (state.instrumentMode === 'overtone' && state.strings.length > 0) {
            const fundamentalLength = state.strings[0].length;
            panel.style.width = `${(string.length / fundamentalLength) * 100}%`;
        }
        const freq = calculateFrequency(string); 
        const edoInfo = frequencyToEdoInfo(freq);
        const noteName = `${edoInfo.noteName}${edoInfo.octave}`;
        panel.innerHTML = `<div class="input-group"><label for="len-${index}">Len:</label><input type="number" id="len-${index}" value="${string.length.toFixed(1)}" step="0.1" min="1" max="50"></div><div class="input-group"><label for="wid-${index}">Gauge:</label><input type="number" id="wid-${index}" value="${string.width.toFixed(3)}" step="0.001" min="0.007" max="0.080"></div><div class="input-group"><label for="ten-${index}">Ten (lbs):</label><input type="number" id="ten-${index}" value="${string.tension.toFixed(1)}" step="0.5" min="5" max="50"></div><div class="info-display"><span>${freq.toFixed(1)} Hz</span><span>${noteName}</span></div><button class="remove-string-btn" data-string-index="${index}" title="Remove this string">X</button>`; stringControlsContainer.appendChild(panel); const resetMode = () => { state.instrumentMode = null; updateGlobalControls(); }; panel.querySelector(`#len-${index}`).addEventListener('input', e => { clearTheory(); state.strings[index].length = parseFloat(e.target.value) || 0; resetMode(); renderApp(); }); panel.querySelector(`#wid-${index}`).addEventListener('input', e => { clearTheory(); state.strings[index].width = parseFloat(e.target.value) || 0; resetMode(); renderApp(); }); panel.querySelector(`#ten-${index}`).addEventListener('input', e => { clearTheory(); state.strings[index].tension = parseFloat(e.target.value) || 0; resetMode(); renderApp(); }); }
    function renderFretNumbers() { const openSpace = document.createElement('div'); openSpace.className = 'open-string-space'; fretNumbersContainer.appendChild(openSpace); const frettedArea = document.createElement('div'); frettedArea.className = 'fretted-area'; const refFretPositions = state.fretPositions[0] || []; for (let j = 0; j < state.frets; j++) { const numEl = document.createElement('div'); numEl.className = 'fret-number'; numEl.textContent = j + 1; numEl.style.width = `${(refFretPositions[j+1] || 100) - (refFretPositions[j] || 0)}%`; frettedArea.appendChild(numEl); } fretNumbersContainer.appendChild(frettedArea); }
    function renderStringRow(string, i) {
        const stringRow = document.createElement('div'); stringRow.className = 'string-row'; stringRow.dataset.stringIndex = i;
        if (state.instrumentMode === 'overtone' && state.strings.length > 0) {
            const fundamentalLength = state.strings[0].length;
            stringRow.style.width = `${(string.length / fundamentalLength) * 100}%`;
        }
        const thickness = getVisualThickness(string.width); stringRow.style.setProperty('--string-thickness', `${thickness.toFixed(2)}px`); const openSpace = document.createElement('div'); openSpace.className = 'fret-space open-string-space'; openSpace.dataset.stringIndex = i; openSpace.dataset.fretIndex = -1; stringRow.appendChild(openSpace); const frettedArea = document.createElement('div'); frettedArea.className = 'fretted-area';
        if (state.fretPositions[i]) { for (let j = 0; j < state.frets; j++) { const fretSpace = document.createElement('div'); fretSpace.className = 'fret-space'; fretSpace.style.width = `${state.fretPositions[i][j + 1] - state.fretPositions[i][j]}%`; fretSpace.dataset.stringIndex = i; fretSpace.dataset.fretIndex = j; frettedArea.appendChild(fretSpace); if (j < state.frets) { const fretDivider = document.createElement('div'); fretDivider.className = 'fret-divider'; fretDivider.style.left = `${state.fretPositions[i][j + 1]}%`; fretDivider.dataset.stringIndex = i; fretDivider.dataset.fretIndex = j + 1; frettedArea.appendChild(fretDivider); } } }
        stringRow.appendChild(frettedArea);
        state.notes.forEach(note => {
            if (note.string !== i || note.fret === null) return;
            const noteEl = document.createElement('div');
            noteEl.className = 'note';
            noteEl.dataset.string = note.string;
            noteEl.dataset.fretIndex = note.fret;

            if (state.highlightedNotes.some(hn => hn.string === note.string && hn.fret === note.fret)) {
                noteEl.classList.add('highlighted');
            }
            
            const frettedFreq = calculateFrettedFrequency(note.string, note.fret);
            const edoInfo = frequencyToEdoInfo(frettedFreq);
            let label = '';
            
            // --- NEW: Interval Color Logic ---
            const rootFreq = getRootFrequency();
            const rootEdoInfo = frequencyToEdoInfo(rootFreq);
            let intervalColor = '#4a90e2'; // Default color

            if (rootEdoInfo && edoInfo && state.temperament === 12) {
                const intervalSteps = edoInfo.absoluteStep - rootEdoInfo.absoluteStep;
                const normalizedInterval = (intervalSteps % 12 + 12) % 12;
                const intervalName = INTERVAL_NAMES[normalizedInterval];
                if (state.intervalColors[intervalName]) {
                    intervalColor = state.intervalColors[intervalName];
                }
            }
            noteEl.style.background = intervalColor;
            // --- END NEW ---

            switch(state.noteDisplayMode) {
                case 'names':
                    label = `${edoInfo.noteName}${edoInfo.octave}`;
                    break;
                case 'frequencies':
                    label = `${frettedFreq.toFixed(0)}Hz`;
                    break;
                case 'intervals':
                case 'intervals_roman':
                    if (rootEdoInfo && edoInfo) {
                        const intervalSteps = edoInfo.absoluteStep - rootEdoInfo.absoluteStep;
                        
                        if (state.temperament === 12) {
                            if (state.noteDisplayMode === 'intervals_roman') {
                                const normalizedInterval = (intervalSteps % 12 + 12) % 12;
                                label = ROMAN_INTERVAL_NAMES[normalizedInterval] || '?';
                            } else {
                                label = note.interval || INTERVAL_NAMES[intervalSteps] || INTERVAL_NAMES[(intervalSteps % 12 + 12) % 12] || '?';
                            }
                        } else {
                            const edoData = EDO_SYSTEMS[state.temperament] || {};
                            const normalizedInterval = (intervalSteps % state.temperament + state.temperament) % state.temperament;
                            label = (edoData.intervals && edoData.intervals[normalizedInterval]) ? edoData.intervals[normalizedInterval] : `${intervalSteps}`;
                        }
                    } else {
                        label = '?';
                    }
                    break;
                case 'fingerings': noteEl.textContent = note.finger ? note.finger : (note.fret === -1 ? 'O' : (note.fret + 1)); break;
                case 'cents': let rootInOctaveMidi = Math.floor(frequencyToMidi(frettedFreq) / 12) * 12 + parseInt(rootNoteSelect.value); if (rootInOctaveMidi > frequencyToMidi(frettedFreq)) rootInOctaveMidi -= 12; const rootInOctaveFreq = 440 * Math.pow(2, (rootInOctaveMidi - 69) / 12); const cents = 1200 * Math.log2(frettedFreq / rootInOctaveFreq); noteEl.textContent = `${cents.toFixed(0)}¢`; break;
            }
            if (label) {
                noteEl.textContent = label;
            }

            if (note.fret === -1) { noteEl.style.left = '50%'; openSpace.appendChild(noteEl); } 
            else { const fretStart = state.fretPositions[note.string][note.fret], fretEnd = state.fretPositions[note.string][note.fret + 1]; noteEl.style.left = `${fretStart + (fretEnd - fretStart) / 2}%`; frettedArea.appendChild(noteEl); }
        });
        fretboardContainer.appendChild(stringRow);
    }
    
    function renderIntervalColorPickers() {
        intervalColorControls.innerHTML = '';
        Object.keys(state.intervalColors).forEach(intervalName => {
            const pickerContainer = document.createElement('div');
            pickerContainer.className = 'interval-color-picker';

            const label = document.createElement('label');
            label.textContent = intervalName;
            label.htmlFor = `color-${intervalName}`;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = `color-${intervalName}`;
            colorInput.value = state.intervalColors[intervalName];

            colorInput.addEventListener('input', (e) => {
                state.intervalColors[intervalName] = e.target.value;
                if(state.currentChord || state.currentScale || state.notes.length > 0) {
                   renderApp(); 
                }
            });

            pickerContainer.appendChild(label);
            pickerContainer.appendChild(colorInput);
            intervalColorControls.appendChild(pickerContainer);
        });
    }

    // --- EVENT LISTENERS & HANDLERS ---
    function attachEventListeners() { 
        document.body.addEventListener('click', handleDelegatedClick); 
        fretboardContainer.addEventListener('mousedown', handleFretDragStart); 
    }
    function handleDelegatedClick(e) {
        const noteEl = e.target.closest('.note');
        const fretSpace = e.target.closest('.fret-space');
        const targetElement = noteEl || fretSpace;

        if (targetElement) {
            const stringIndex = parseInt(targetElement.dataset.stringIndex ?? noteEl?.dataset.string);
            const fretIndex = parseInt(targetElement.dataset.fretIndex ?? noteEl?.dataset.fretIndex);
            const noteExists = state.notes.some(n => n.string === stringIndex && n.fret === fretIndex);

            // If a pre-defined chord or scale is active, interacting with the board
            // should switch to manual edit mode.
            if (state.currentChord || state.currentScale) {
                state.currentChord = null;
                state.currentScale = null;
                currentRootDisplay.textContent = '';
                currentNotesDisplay.textContent = '';
                CircleOfFifths.updateCircleOfFifths(null);
                CircleOfFifths.updateCircleOfFifths19(null);
                CircleOfFifths.updateCircleOfFifths31(null);
                updateScaleModesDisplay();
                updateDiatonicChordsDisplay();
                alternativeVoicingContainer.style.display = 'none';
            }

            switch (state.interactionMode) {
                case 'toggle_note':
                    if (noteExists) { removeNote(stringIndex, fretIndex); } else { addNote(stringIndex, fretIndex); }
                    break;
                case 'insert':
                    if (!noteExists) { addNote(stringIndex, fretIndex); }
                    break;
                case 'remove':
                    if (noteExists) { removeNote(stringIndex, fretIndex); }
                    break;
                case 'play':
                    AudioMidi.AudioPlayer.playNote(calculateFrettedFrequency(stringIndex, fretIndex), 0);
                    break;
            }
            return;
        }

        const chordBtn = e.target.closest('.diatonic-chord-btn');
        if (chordBtn) {
            handleDiatonicChordClick(chordBtn);
            return;
        }
        
        const removeBtn = e.target.closest('.remove-string-btn'); 
        if (removeBtn) { removeString(parseInt(removeBtn.dataset.stringIndex)); return; }
        const recognizedChordEl = e.target.closest('#recognized-chord-display');
        if (recognizedChordEl && recognizedChordEl.dataset.type) {
            rootNoteSelect.value = recognizedChordEl.dataset.rootIndex;
            chordTypeSelect.value = recognizedChordEl.dataset.type;
            handleShowChord();
            return;
        }
        const recognizedScaleEl = e.target.closest('#recognized-scale-display');
        if (recognizedScaleEl && recognizedScaleEl.dataset.type) {
            rootNoteSelect.value = recognizedScaleEl.dataset.rootIndex;
            scaleTypeSelect.value = recognizedScaleEl.dataset.type;
            handleShowScale();
            return;
        }
    }
    let dragInfo = null;
    function handleFretDragStart(e) { 
        if (state.interactionMode !== 'move_fret' || !e.target.classList.contains('fret-divider')) return; 
        const stringIndex = parseInt(e.target.dataset.stringIndex), fretIndex = parseInt(e.target.dataset.fretIndex); 
        if (fretIndex === 0 || fretIndex > state.frets) return; 
        dragInfo = { element: e.target, stringIndex, fretIndex, startX: e.clientX, fretboardWidth: e.target.parentElement.clientWidth }; 
        document.addEventListener('mousemove', handleFretDrag); 
        document.addEventListener('mouseup', handleFretDragEnd); 
    }
    function handleFretDrag(e) { if(!dragInfo) return; e.preventDefault(); const dx = e.clientX - dragInfo.startX, dPercent = (dx / dragInfo.fretboardWidth) * 100, originalPos = state.fretPositions[dragInfo.stringIndex][dragInfo.fretIndex]; let newPos = originalPos + dPercent; const leftBoundary = state.fretPositions[dragInfo.stringIndex][dragInfo.fretIndex - 1] + 1, rightBoundary = state.fretPositions[dragInfo.stringIndex][dragInfo.fretIndex + 1] - 1; newPos = Math.max(leftBoundary, Math.min(newPos, rightBoundary)); dragInfo.element.style.left = `${newPos}%`; }
    function handleFretDragEnd(e) { if (!dragInfo) return; const finalPercent = parseFloat(dragInfo.element.style.left); state.fretPositions[dragInfo.stringIndex][dragInfo.fretIndex] = finalPercent; dragInfo = null; document.removeEventListener('mousemove', handleFretDrag); document.removeEventListener('mouseup', handleFretDragEnd); renderApp(); }
    
    function convertIntervalsToEdo(intervals12, targetEdo) {
        if (targetEdo === 12) return intervals12;
        const ratio = targetEdo / 12.0;
        return intervals12.map(i => Math.round(i * ratio));
    }
    function findEdoVoicing(rootFrequency, edoIntervals) {
        const rootEdoInfo = frequencyToEdoInfo(rootFrequency);
        if (!rootEdoInfo) return []; // Guard
        const rootAbsoluteStep = rootEdoInfo.absoluteStep;
        const chordAbsoluteSteps = edoIntervals.map(i => rootAbsoluteStep + i);
        
        let voicing = [];
        for (let i = 0; i < state.strings.length; i++) {
            let bestFret = null;
            for (let j = -1; j < state.frets; j++) {
                const noteEdoInfo = frequencyToEdoInfo(calculateFrettedFrequency(i, j));
                if (noteEdoInfo && chordAbsoluteSteps.includes(noteEdoInfo.absoluteStep)) {
                    bestFret = j;
                    break;
                }
            }
            voicing.push({ string: i, fret: bestFret });
        }
        return voicing;
    }
    function handleShowChord() {
        const rootStep = parseInt(rootNoteSelect.value);
        const chordType = chordTypeSelect.value;
        const chordDef = state.currentChordDefs[chordType];
        if (!chordDef) return;

        // Reset alternative voicing state
        alternativeVoicingContainer.style.display = 'none';
        state.showingAlternativeVoicing = false;

        const baseIntervals = chordStepsToAbsoluteIntervals(chordDef.steps);
        
        let voicing;
        if (state.temperament === 12) {
            voicing = findChordVoicing(rootStep, chordType, false);
        } else {
            const rootFrequency = getRootFrequency();
            const edoIntervals = convertIntervalsToEdo(baseIntervals, state.temperament);
            voicing = findEdoVoicing(rootFrequency, edoIntervals);
        }
        
        clearTheory(false);
        state.currentChord = { root: rootStep, type: chordType, notes: voicing };
        state.notes = voicing;
        
        const rootNoteName = rootNoteSelect.options[rootNoteSelect.selectedIndex].text;
        let noteNames;
        if (state.temperament === 12) {
            noteNames = baseIntervals.map(i => NOTE_NAMES[(rootStep + i) % 12]).join(' · ');
        } else {
            const edoData = EDO_SYSTEMS[state.temperament] || { names: [] };
            const edoIntervals = convertIntervalsToEdo(baseIntervals, state.temperament);
            noteNames = edoIntervals.map(i => edoData.names[(rootStep + i) % state.temperament] || '?').join(' · ');
        }
        currentRootDisplay.textContent = `Root: ${rootNoteName}`;
        currentNotesDisplay.textContent = `${chordType} (${state.temperament}-EDO): ${noteNames}`;
        currentIntervalsContainer.style.display = 'none';

        // Check for and show the alternative voicing button
        const rootNoteNameForAlt = NOTE_NAMES[rootStep];
        if (state.temperament === 12 && ALTERNATIVE_VOICING_LIBRARY[rootNoteNameForAlt] && ALTERNATIVE_VOICING_LIBRARY[rootNoteNameForAlt][chordType]) {
            alternativeVoicingContainer.style.display = 'block';
            alternativeVoicingBtn.textContent = 'Display Alternative Voicing';
        }

        if (state.temperament === 12) {
            CircleOfFifths.updateCircleOfFifths(rootStep, 'Major (Ionian)');
        } else {
            CircleOfFifths.updateCircleOfFifths(null); // Clear the 12-EDO one
            CircleOfFifths.updateCircleOfFifths19(null); // Clear the 19-EDO one
            CircleOfFifths.updateCircleOfFifths31(null);
        }
        updateScaleModesDisplay();
        updateDiatonicChordsDisplay();
        renderApp();
    }
    function handleShowAlternativeVoicing() {
        if (!state.currentChord) return;

        state.showingAlternativeVoicing = !state.showingAlternativeVoicing;

        const { root, type } = state.currentChord;
        const voicing = findChordVoicing(root, type, state.showingAlternativeVoicing);

        if (voicing) {
            state.notes = voicing;
            state.currentChord.notes = voicing;
            alternativeVoicingBtn.textContent = state.showingAlternativeVoicing ? 'Display Common Voicing' : 'Display Alternative Voicing';
            renderApp();
        }
    }
    function showScaleOnFretboard(rootFrequency, edoIntervals, scaleType) {
        clearTheory(false);
        state.currentScale = { root: parseInt(rootNoteSelect.value), type: scaleType, intervals: edoIntervals };
        state.notesPerStringLimit = notesPerStringSelect.value;
        
        const rootEdoInfo = frequencyToEdoInfo(rootFrequency);
        if (!rootEdoInfo) { state.notes = []; renderApp(); return; } // Guard
        const rootStepInOctave = rootEdoInfo.stepInOctave;
        const scaleStepsInOctave = new Set(edoIntervals.map(i => (rootStepInOctave + i) % state.temperament));

        let allPossibleScaleNotes = [];
        for (let i = 0; i < state.strings.length; i++) {
            for (let j = -1; j < state.frets; j++) {
                const freq = calculateFrettedFrequency(i, j);
                if (freq <= 0) continue;
                const noteEdoInfo = frequencyToEdoInfo(freq);
                if (noteEdoInfo && scaleStepsInOctave.has(noteEdoInfo.stepInOctave)) {
                    allPossibleScaleNotes.push({ string: i, fret: j, freq: freq });
                }
            }
        }

        if (state.notesPerStringLimit === 'all') {
            state.notes = allPossibleScaleNotes;
        } else {
            const limit = parseInt(state.notesPerStringLimit, 10);
            const sortedScaleNotes = allPossibleScaleNotes.sort((a, b) => a.freq - b.freq);
            let startIndex = -1;
            for (let i = 0; i < sortedScaleNotes.length; i++) {
                const noteEdoInfo = frequencyToEdoInfo(sortedScaleNotes[i].freq);
                if (noteEdoInfo && noteEdoInfo.stepInOctave === rootStepInOctave) {
                    startIndex = i;
                    break;
                }
            }

            if (startIndex === -1) {
                const notesByString = sortedScaleNotes.reduce((acc, note) => { (acc[note.string] = acc[note.string] || []).push(note); return acc; }, {});
                state.notes = Object.values(notesByString).flatMap(stringNotes => stringNotes.slice(0, limit));
            } else {
                const finalNotes = [];
                const notesPerStringCount = {}; 
                for (let i = startIndex; i < sortedScaleNotes.length; i++) {
                    const note = sortedScaleNotes[i];
                    notesPerStringCount[note.string] = notesPerStringCount[note.string] || 0;
                    if (notesPerStringCount[note.string] < limit) {
                        finalNotes.push(note);
                        notesPerStringCount[note.string]++;
                    }
                }
                state.notes = finalNotes;
            }
        }
        renderApp();
    }
    function handleShowScale() {
        const rootStep = parseInt(rootNoteSelect.value);
        const scaleType = scaleTypeSelect.value;
        const edoIntervals = state.currentScaleDefs[scaleType];
        if (!edoIntervals) return;

        // Hide alt voicing button when showing a scale
        alternativeVoicingContainer.style.display = 'none';
        state.showingAlternativeVoicing = false;
        
        state.highlightedNotes = []; // Clear any previously highlighted chord

        const rootNoteName = rootNoteSelect.options[rootNoteSelect.selectedIndex].text;
        let noteNames;
        if (state.temperament === 12) {
            noteNames = edoIntervals.map(i => NOTE_NAMES[(rootStep + i) % 12]).join(' · ');
        } else {
            const edoData = EDO_SYSTEMS[state.temperament] || { names: [] };
            noteNames = edoIntervals.map(i => edoData.names[(rootStep + i) % state.temperament] || '?').join(' · ');
        }

        currentRootDisplay.textContent = `Root: ${rootNoteName}`;
        currentNotesDisplay.textContent = `Scale (${scaleType} in ${state.temperament}-EDO): ${noteNames}`;

        // --- NEW LOGIC for INTERVAL DISPLAY ---
        let intervalNames;
        if (state.temperament === 12) {
            intervalNames = edoIntervals.map(i => INTERVAL_NAMES[i] || '?');
        } else if (EDO_SYSTEMS[state.temperament]) {
            const edoData = EDO_SYSTEMS[state.temperament];
            intervalNames = edoIntervals.map(i => (edoData.intervals && edoData.intervals[i]) ? edoData.intervals[i] : `S:${i}`);
        }

        if(intervalNames) {
            currentIntervalsDisplay.textContent = `Intervals: ${intervalNames.join(' · ')}`;
            currentIntervalsContainer.style.display = 'flex';
        } else {
            currentIntervalsContainer.style.display = 'none';
        }
        // --- END NEW LOGIC ---

        showScaleOnFretboard(getRootFrequency(), edoIntervals, scaleType);

        // Clear all circles first
        CircleOfFifths.updateCircleOfFifths(null);
        CircleOfFifths.updateCircleOfFifths19(null);
        CircleOfFifths.updateCircleOfFifths31(null);

        // Then, update the correct one based on the current temperament
        if (state.temperament === 12) {
            CircleOfFifths.updateCircleOfFifths(rootStep, scaleType);
        } else if (state.temperament === 19) {
            CircleOfFifths.updateCircleOfFifths19(rootStep, scaleType);
        } else if (state.temperament === 31) {
            CircleOfFifths.updateCircleOfFifths31(rootStep, scaleType);
        }

        updateScaleModesDisplay(scaleType, getRootFrequency());
        updateDiatonicChordsDisplay(scaleType, rootStep);
    }
    function handleRandomScale() { 
        const options = Array.from(scaleTypeSelect.options);
        if (options.length === 0) return;
        rootNoteSelect.selectedIndex = Math.floor(Math.random() * rootNoteSelect.options.length); 
        scaleTypeSelect.selectedIndex = Math.floor(Math.random() * options.length); 
        handleShowScale(); 
    }
    function handleShowAllNotes() { clearTheory(); let allNotes = []; for (let i = 0; i < state.strings.length; i++) { for (let j = -1; j < state.frets; j++) { allNotes.push({string: i, fret: j}); } } state.notes = allNotes; renderApp(); }
    function clearTheory(clearDisplays = true) {
        state.notes = [];
        state.highlightedNotes = [];
        state.currentChord = null;
        state.currentScale = null;
        alternativeVoicingContainer.style.display = 'none';
        state.showingAlternativeVoicing = false;
        diatonicChordsContainer.innerHTML = '';
        if (clearDisplays) {
            CircleOfFifths.updateCircleOfFifths(null);
            CircleOfFifths.updateCircleOfFifths19(null);
            CircleOfFifths.updateCircleOfFifths31(null);
            updateScaleModesDisplay();
            currentRootDisplay.textContent = '';
            currentNotesDisplay.textContent = '';
            currentIntervalsContainer.style.display = 'none';
        }
        renderApp();
    }
    function handleSetupChange(e) {
        TabEditor.stop();
        const setup = e.target.value;
        if (!setup) return;
        
        state.instrumentMode = null;
        
        clearTheory();
        switch (setup) {
            case 'guitar': setTuning(6, 12, GUITAR_TUNING_HZ, GUITAR_GAUGES, 12); break;
            case 'bass': setTuning(4, 20, BASS_TUNING_HZ, BASS_GAUGES, 12); break;
            case 'ukulele': setTuning(4, 12, UKULELE_TUNING_HZ, UKULELE_GAUGES, 12); break;
            case 'drop_d': setTuning(6, 12, DROP_D_TUNING_HZ, DROP_D_GAUGES, 12); break;
            case 'open_g': setTuning(6, 12, OPEN_G_TUNING_HZ, OPEN_G_GAUGES, 12); break;
            case 'dadgad': setTuning(6, 12, DADGAD_TUNING_HZ, DADGAD_GAUGES, 12); break;
            case '7_string': setTuning(7, 24, SEVEN_STRING_TUNING_HZ, SEVEN_STRING_GAUGES, 12); break;
            case '8_string': setTuning(8, 24, EIGHT_STRING_TUNING_HZ, EIGHT_STRING_GAUGES, 12); break;
            case 'just_intonation': setTuning(6, 12, GUITAR_TUNING_HZ, GUITAR_GAUGES, 'just'); break;
            case 'true_temperament': setTuning(6, 12, GUITAR_TUNING_HZ, GUITAR_GAUGES, 'true_temperament'); break;
            case '19_edo': setTuning(6, 19, GUITAR_TUNING_HZ, GUITAR_GAUGES, 19); break;
            case '24_edo': setTuning(6, 24, GUITAR_TUNING_HZ, GUITAR_GAUGES, 24); break;
            case '31_edo': setTuning(6, 31, GUITAR_TUNING_HZ, GUITAR_GAUGES, 31); break;
            case 'kantele_5_major': setTuning(5, 0, KANTELE_5_MAJOR_HZ, KANTELE_5_GAUGES, 12); break;
            case 'kantele_5_minor': setTuning(5, 0, KANTELE_5_MINOR_HZ, KANTELE_5_MINOR_GAUGES, 12); break;
            case 'kantele_11': setTuning(11, 0, KANTELE_11_HZ, KANTELE_11_GAUGES, 12); break;
            case 'overtone': setupOvertoneSeries(); break;
        }
        updateTheoryDefinitions();
        TabEditor.init();
        renderApp();
        e.target.value = "";
    }
    function setTuning(numStrings, numFrets, tuningHz, gauges, temperamentSystem = 12) { 
        state.frets = numFrets; 
        state.strings = Array.from({ length: numStrings }, (_, i) => createStringWithTuning(tuningHz[i], gauges[i]));
        state.temperament = (typeof temperamentSystem === 'number') ? temperamentSystem : 12;
        updateRootDropdown();
        generateInitialFretPositions(temperamentSystem); 
    }
    function setupOvertoneSeries() {
        const fundamentalHz = 110.00; // A2
        const numStrings = 8;
        const OVERTONE_BASE_GAUGE = 0.011;
        const OVERTONE_BASE_TENSION = 15.0;

        let newStrings = [];
        for (let i = 0; i < numStrings; i++) {
            const harmonic = i + 1;
            const freq = fundamentalHz * harmonic;
            const len = calculateLength(OVERTONE_BASE_TENSION, OVERTONE_BASE_GAUGE, freq);
            newStrings.push({ length: len, width: OVERTONE_BASE_GAUGE, tension: OVERTONE_BASE_TENSION });
        }
        state.strings = newStrings;
        state.frets = 0;
        state.instrumentMode = 'overtone';
        state.overtoneFundamentalHz = fundamentalHz;
        generateInitialFretPositions();
        TabEditor.init();
    }
    function handleReverseView() { state.isPlayerView = !state.isPlayerView; renderApp(); }
    function handleLeftHandedToggle() { state.isLeftHanded = !state.isLeftHanded; renderApp(); }
    function handleInteractionChange(e) {
        state.interactionMode = e.target.value;
        updateFretboardModeClass();
    }
    function updateFretboardModeClass() {
        fretboardContainer.classList.remove('mode-toggle_note', 'mode-insert', 'mode-remove', 'mode-play', 'mode-move_fret');
        fretboardContainer.classList.add(`mode-${state.interactionMode}`);
    }

    // --- Note Playback & Animation ---
    function playNoteSequenceWithAnimation(notes, delay) {
        if (!notes || notes.length === 0) return;
        notes.forEach((note, i) => {
            setTimeout(() => {
                const freq = calculateFrettedFrequency(note.string, note.fret);
                if (freq > 0) AudioMidi.AudioPlayer.playNote(freq, 0);
                const fretSpaceEl = document.querySelector(`.fret-space[data-string-index='${note.string}'][data-fret-index='${note.fret}']`);
                if (fretSpaceEl) {
                    fretSpaceEl.classList.add('note-playing');
                    setTimeout(() => fretSpaceEl.classList.remove('note-playing'), 300);
                }
            }, i * delay);
        });
    }
    function handlePlayStrum() {
        if (state.notes.length === 0) return;
        const notesToPlay = state.highlightedNotes.length > 0 ? state.highlightedNotes : state.notes;
        const notesByString = new Map();
        notesToPlay.forEach(note => {
            if (!notesByString.has(note.string) || note.fret > notesByString.get(note.string).fret) {
                notesByString.set(note.string, note);
            }
        });
        const strumNotes = Array.from(notesByString.values()).sort((a, b) => a.string - b.string);
        playNoteSequenceWithAnimation(strumNotes, 50);
    }
    function handlePlayShred() {
        if (state.notes.length === 0) return;
        const notesToPlay = state.highlightedNotes.length > 0 ? state.highlightedNotes : state.notes;
        const shredNotes = [...notesToPlay].sort((a, b) => {
            if (a.string !== b.string) return a.string - b.string;
            return a.fret - b.fret;
        });
        playNoteSequenceWithAnimation(shredNotes, 80);
    }
    
    function handleFullScreenToggle() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    function handleScreenshot() {
        const appElement = document.getElementById('app');
        html2canvas(appElement, { 
            backgroundColor: '#333',
            useCORS: true 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'fretboard-screenshot.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        });
    }

    // --- STATE MODIFICATION ---
    function addNote(string, fretIndex) { state.notes.push({ string: string, fret: fretIndex }); renderApp(); }
    function removeNote(string, fretIndex) { state.notes = state.notes.filter(n => !(n.string === string && n.fret === fretIndex)); renderApp(); }
    function addString(location) {
        if (state.strings.length >= MAX_STRINGS) return;
        TabEditor.stop();
        
        if (location === 'high' && state.instrumentMode === 'overtone') {
            const numStrings = state.strings.length;
            const newHarmonic = numStrings + 1;
            const newFreq = state.overtoneFundamentalHz * newHarmonic;
            const baseTension = state.strings[0].tension;
            const baseWidth = state.strings[0].width;
            const newLength = calculateLength(baseTension, baseWidth, newFreq);
            const newString = { length: newLength, width: baseWidth, tension: baseTension };
            state.strings.push(newString);
        } else {
            state.instrumentMode = null;
            const isLow = location === 'low';
            if (state.strings.length === 0) {
                state.strings.push(createStringWithTuning(82.41, 0.042));
            } else {
                const semitoneShift = isLow ? -5 : 5;
                const gaugeRatio = isLow ? 1.3 : 1 / 1.3;
                const refIndex = isLow ? 0 : state.strings.length - 1;
                const refString = state.strings[refIndex];
                const refFreq = calculateFrequency(refString);
                const newFreq = refFreq * Math.pow(2, semitoneShift / 12);
                const newGauge = refString.width * gaugeRatio;
                const newString = createStringWithTuning(newFreq, newGauge);
                if (isLow) {
                    state.strings.unshift(newString);
                    if (state.currentChord || state.currentScale) clearTheory();
                    state.notes.forEach(n => n.string++);
                } else {
                    state.strings.push(newString);
                }
            }
        }
        
        generateInitialFretPositions();
        TabEditor.init();
        renderApp();
    }
    function removeString(indexToRemove) { if (state.strings.length <= MIN_STRINGS) return; TabEditor.stop(); clearTheory(); state.strings.splice(indexToRemove, 1); state.fretPositions.splice(indexToRemove, 1); state.notes = state.notes.filter(n => n.string !== indexToRemove).map(n => { if (n.string > indexToRemove) n.string--; return n; }); state.instrumentMode = null; TabEditor.init(); renderApp(); }
    function changeFrets(amount) { const newCount = state.frets + amount; if (newCount >= MIN_FRETS && newCount <= MAX_FRETS) { clearTheory(); state.frets = newCount; generateInitialFretPositions(state.temperament); renderApp(); } }
    
    // --- THEORY DISPLAY (MODES/CHORDS) ---
    function handleDiatonicChordClick(button) {
        const chordIntervalsStr = button.dataset.intervals.split(',').map(Number);
        const rootNoteIndex = parseInt(button.dataset.root, 10);
        
        const chordNoteIndexes = new Set(chordIntervalsStr.map(i => (rootNoteIndex + i) % 12));

        state.highlightedNotes = state.notes.filter(note => {
            const freq = calculateFrettedFrequency(note.string, note.fret);
            const midi = frequencyToMidi(freq);
            return chordNoteIndexes.has(midi % 12);
        });

        if (state.interactionMode === 'play') {
            const notesToPlay = state.highlightedNotes.filter(note => note.fret !== null);
            const notesByString = new Map();
            notesToPlay.forEach(note => {
                if (!notesByString.has(note.string) || note.fret < notesByString.get(note.string).fret) {
                    notesByString.set(note.string, note);
                }
            });
            playNoteSequenceWithAnimation(Array.from(notesByString.values()), 50);
        }

        renderApp();
    }

    function updateDiatonicChordsDisplay(scaleName, rootNoteIndex) {
        diatonicChordsContainer.innerHTML = '';
        if (!scaleName || rootNoteIndex === undefined || state.temperament !== 12) {
            return;
        }

        const scaleIntervals = state.currentScaleDefs[scaleName];
        if (!scaleIntervals) return;

        const scalePitchClasses = new Set(scaleIntervals.map(i => (rootNoteIndex + i) % 12));

        scaleIntervals.forEach((scaleDegreeInterval, degreeIndex) => {
            const chordRootIndex = (rootNoteIndex + scaleDegreeInterval) % 12;
            
            const minorThirdIndex = (chordRootIndex + 3) % 12;
            const majorThirdIndex = (chordRootIndex + 4) % 12;
            const diminishedFifthIndex = (chordRootIndex + 6) % 12;
            const perfectFifthIndex = (chordRootIndex + 7) % 12;
            
            let chordType = null;
            let chordIntervals = null;
            let romanNumeral = DIATONIC_DEGREES[degreeIndex] || (degreeIndex + 1).toString();

            if (scalePitchClasses.has(majorThirdIndex) && scalePitchClasses.has(perfectFifthIndex)) {
                chordType = 'Major';
                chordIntervals = [0, 4, 7];
            } else if (scalePitchClasses.has(minorThirdIndex) && scalePitchClasses.has(perfectFifthIndex)) {
                chordType = 'Minor';
                chordIntervals = [0, 3, 7];
                romanNumeral = romanNumeral.toLowerCase();
            } else if (scalePitchClasses.has(minorThirdIndex) && scalePitchClasses.has(diminishedFifthIndex)) {
                chordType = 'Diminished';
                chordIntervals = [0, 3, 6];
                romanNumeral = romanNumeral.toLowerCase() + '°';
            }

            if (chordType) {
                const chordRootName = NOTE_NAMES[chordRootIndex];
                const btn = document.createElement('button');
                btn.className = 'diatonic-chord-btn';
                btn.textContent = `${romanNumeral}: ${chordRootName} ${chordType}`;
                btn.dataset.root = chordRootIndex;
                btn.dataset.intervals = chordIntervals.join(',');
                diatonicChordsContainer.appendChild(btn);
            }
        });
    }

    function createModePieChart(steps) {
        const size = 40, radius = size / 2;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        let startAngle = -90;
        function polarToCartesian(cx, cy, r, angle) { return { x: cx + r * Math.cos((angle) * Math.PI / 180), y: cy + r * Math.sin((angle) * Math.PI / 180) }; }
        const totalSteps = steps.reduce((a, b) => a + b, 0);
        if (totalSteps === 0) return svg;
        steps.forEach(step => {
            const sliceAngle = (step / totalSteps) * 360;
            const endAngle = startAngle + sliceAngle;
            const start = polarToCartesian(radius, radius, radius, startAngle);
            const end = polarToCartesian(radius, radius, radius, endAngle);
            const largeArcFlag = sliceAngle > 180 ? '1' : '0';
            const d = `M ${radius},${radius} L ${start.x},${start.y} A ${radius},${radius} 0 ${largeArcFlag} 1 ${end.x},${end.y} Z`;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            let color = '#888'; // Default for other steps
            if (step === 1) color = '#555';
            if (step === 2) color = '#ddd';
            if (step === 3) color = '#a0522d'; // Sienna brown
            if (step === 4) color = '#8B4513'; // Saddle brown
            path.setAttribute('fill', color);
            path.setAttribute('stroke', '#333');
            path.setAttribute('stroke-width', '0.5');
            svg.appendChild(path);
            startAngle = endAngle;
        });
        return svg;
    }

    function updateScaleModesDisplay(parentScaleName, parentRootFrequency) {
        scaleModesList.innerHTML = '';
        const parentIntervals = state.currentScaleDefs[parentScaleName];

        if (!parentScaleName || !parentIntervals || !state.scaleStepsToNameMap || !parentRootFrequency) {
            scaleModesContainer.style.display = 'none';
            return;
        }
        scaleModesContainer.style.display = 'flex';

        const rootFreq = parentRootFrequency;
        const rootEdoInfo = frequencyToEdoInfo(rootFreq);
        if (!rootEdoInfo) return; // Guard
        const rootStepInOctave = rootEdoInfo.stepInOctave;

        parentIntervals.forEach((interval, i) => {
            const modeRootStep = (rootStepInOctave + interval) % state.temperament;
            const modeRootName = (EDO_SYSTEMS[state.temperament]?.names[modeRootStep] || `S:${modeRootStep}`);

            const modeIntervals = parentIntervals.map(p_int => (p_int - interval + state.temperament) % state.temperament).sort((a, b) => a - b);
            const modeSteps = modeIntervals.map((n, j) => {
                const next = modeIntervals[j + 1] || (modeIntervals[0] + state.temperament);
                return next - n;
            });

            const modeStepsKey = JSON.stringify(modeSteps);
            const foundModeName = state.scaleStepsToNameMap.get(modeStepsKey);
            
            const modeNumberDisplay = i + 1;
            const modeDisplayName = foundModeName || `${parentScaleName} Mode ${modeNumberDisplay}`;
            
            const li = document.createElement('li');
            li.className = 'mode-item';
            
            const textContainer = document.createElement('div');
            textContainer.className = 'mode-text-container';
            textContainer.innerHTML = `<div class="mode-name">${DIATONIC_DEGREES[i] || i+1} - ${modeRootName} ${modeDisplayName}</div><div class="mode-steps">${modeSteps.join('-')}</div>`;
            
            const pieChartSvg = createModePieChart(modeSteps);
            li.appendChild(pieChartSvg);
            li.appendChild(textContainer);
            
            li.addEventListener('click', () => {
                const modeRootFreq = rootFreq * Math.pow(2, interval / state.temperament);
                if (state.interactionMode === 'play') {
                    const frequencies = modeIntervals.map(iv => modeRootFreq * Math.pow(2, iv / state.temperament));
                    AudioMidi.AudioPlayer.playSequence(frequencies);
                    return;
                }

                if (foundModeName) {
                    const newRootEdoInfo = frequencyToEdoInfo(modeRootFreq);
                    if (newRootEdoInfo) {
                        rootNoteSelect.value = newRootEdoInfo.stepInOctave;
                        scaleTypeSelect.value = foundModeName;
                        handleShowScale();
                    }
                }
            });
            scaleModesList.appendChild(li);
        });
    }

    // --- UI UPDATE & INITIALIZATION ---
    function updateTheoryDefinitions() {
        // Chord definitions are simpler and can stay as they are, just combining based on EDO.
        let chordDefs = { ...CHORD_DEFINITIONS };
        if (state.temperament === 19) chordDefs = { ...chordDefs, ...CHORD_DEFINITIONS_19 };
        if (state.temperament === 24) chordDefs = { ...chordDefs, ...CHORD_DEFINITIONS_24 };
        if (state.temperament === 31) chordDefs = { ...chordDefs, ...CHORD_DEFINITIONS_31 };
        state.currentChordDefs = chordDefs;

        // Build scale definitions and the step-to-name reverse map
        const finalScaleDefs = {};
        const stepsToNameMap = new Map();
        const source12EDOScales = state.isZeitlerMode ? ZEITLER_SCALE_DEFINITIONS : SCALE_DEFINITIONS;

        const processScaleSet = (scaleSet) => {
            for (const scaleName in scaleSet) {
                const steps = scaleSet[scaleName];
                finalScaleDefs[scaleName] = stepsToIntervals(steps);
                const stepsKey = JSON.stringify(steps);
                if (!stepsToNameMap.has(stepsKey)) {
                    stepsToNameMap.set(stepsKey, scaleName);
                }
            }
        };

        if (state.temperament === 12) {
            processScaleSet(source12EDOScales);
        } else {
            // Map the standard 12-EDO scales to the current EDO
            for (const scaleName in source12EDOScales) {
                const steps = source12EDOScales[scaleName];
                let convertedSteps = steps.map(s => Math.round(s * (state.temperament / 12.0)));
                const sumOfSteps = convertedSteps.reduce((a, b) => a + b, 0);

                // Correct for rounding errors to ensure the scale sums to the EDO
                if (sumOfSteps !== state.temperament) {
                    const diff = state.temperament - sumOfSteps;
                    convertedSteps[convertedSteps.length - 1] += diff;
                }
                
                const newName = `${scaleName} (→${state.temperament}EDO)`;
                finalScaleDefs[newName] = stepsToIntervals(convertedSteps);
                stepsToNameMap.set(JSON.stringify(convertedSteps), newName);
            }
        }

        // Add the hardcoded, native scales for the current EDO, overwriting any mappings
        const edoSpecificScales = { 19: SCALE_DEFINITIONS_19, 24: SCALE_DEFINITIONS_24, 31: SCALE_DEFINITIONS_31 };
        if (edoSpecificScales[state.temperament]) {
            processScaleSet(edoSpecificScales[state.temperament]);
        }

        state.currentScaleDefs = finalScaleDefs;
        state.scaleStepsToNameMap = stepsToNameMap;
        populateTheoryDropdowns();
    }

    function updateScaleDropdown() {
        const searchTerm = scaleSearchInput.value.toLowerCase();
        const selectedScale = scaleTypeSelect.value;
        
        scaleTypeSelect.innerHTML = '';
        Object.keys(state.currentScaleDefs).sort().forEach(name => {
            if (name.toLowerCase().includes(searchTerm)) {
                scaleTypeSelect.innerHTML += `<option value="${name}">${name}</option>`;
            }
        });

        if (Array.from(scaleTypeSelect.options).some(opt => opt.value === selectedScale)) {
            scaleTypeSelect.value = selectedScale;
        }
    }

    function populateTheoryDropdowns() {
        const selectedChord = chordTypeSelect.value;
        chordTypeSelect.innerHTML = '';
        Object.keys(state.currentChordDefs).sort().forEach(name => {
            chordTypeSelect.innerHTML += `<option value="${name}">${name}</option>`;
        });
        if (Array.from(chordTypeSelect.options).some(opt => opt.value === selectedChord)) {
            chordTypeSelect.value = selectedChord;
        }
        updateScaleDropdown();
    }

    function updateRootDropdown() {
        const currentRootValue = rootNoteSelect.value;
        rootNoteSelect.innerHTML = '';
        const edo = state.temperament || 12;
        let noteNames;
        
        if (edo === 12) {
            noteNames = NOTE_NAMES;
        } else if (EDO_SYSTEMS[edo] && EDO_SYSTEMS[edo].names) {
            noteNames = EDO_SYSTEMS[edo].names;
        } else {
            // Fallback for EDOs without defined names
            noteNames = Array.from({length: edo}, (_, i) => `Step ${i+1}`);
        }

        noteNames.forEach((name, i) => {
            rootNoteSelect.innerHTML += `<option value="${i}">${name}</option>`;
        });
        
        // Try to preserve selection if possible
        if (rootNoteSelect.querySelector(`option[value="${currentRootValue}"]`)) {
            rootNoteSelect.value = currentRootValue;
        } else {
            rootNoteSelect.selectedIndex = 0; // Default to first note
        }
    }
    function updateGlobalControls() { 
        fretCountEl.textContent = state.frets; 
        addHighStringBtn.disabled = state.strings.length >= MAX_STRINGS; 
        addLowStringBtn.disabled = state.strings.length >= MAX_STRINGS || state.instrumentMode === 'overtone';
        removeFretBtn.disabled = state.frets <= MIN_FRETS; 
        addFretBtn.disabled = state.frets >= MAX_FRETS; 
        showFretNumbersBtn.textContent = state.showFretNumbers ? 'Hide Fret #' : 'Show Fret #'; 
        reverseStringsBtn.textContent = state.isPlayerView ? 'Spectator View' : 'Player View';
        
        // Update Left Handed button text based on player and spectator views
        const baseLhText = state.isLeftHanded ? 'Right Handed' : 'Left Handed';
        if (!state.isPlayerView) { // In Spectator View, the perspective is flipped
            leftHandedBtn.textContent = (baseLhText === 'Right Handed') ? 'Left Handed' : 'Right Handed';
        } else {
            leftHandedBtn.textContent = baseLhText;
        }

        document.querySelectorAll('.remove-string-btn').forEach(btn => btn.disabled = (state.strings.length <= MIN_STRINGS)); 
    }

    // Event Listeners
    addLowStringBtn.addEventListener('click', () => addString('low')); addHighStringBtn.addEventListener('click', () => addString('high')); addFretBtn.addEventListener('click', () => changeFrets(1)); removeFretBtn.addEventListener('click', () => changeFrets(-1));
    resetFretsBtn.addEventListener('click', () => { TabEditor.stop(); clearTheory(); state.instrumentMode = null; setTuning(6, 12, GUITAR_TUNING_HZ, GUITAR_GAUGES, 12); updateTheoryDefinitions(); TabEditor.init(); renderApp(); });
    toggleTuningBtn.addEventListener('click', () => { state.tuningPanelVisible = !state.tuningPanelVisible; renderApp(); });
    displayModeSelect.addEventListener('change', (e) => { state.noteDisplayMode = e.target.value; renderApp(); });
    showChordBtn.addEventListener('click', handleShowChord); clearFretboardBtn.addEventListener('click', () => clearTheory(true));
    playStrumBtn.addEventListener('click', handlePlayStrum);
    playShredBtn.addEventListener('click', handlePlayShred);
    showScaleBtn.addEventListener('click', handleShowScale); randomScaleBtn.addEventListener('click', handleRandomScale);
    showAllNotesBtn.addEventListener('click', handleShowAllNotes);
    showFretNumbersBtn.addEventListener('click', () => { state.showFretNumbers = !state.showFretNumbers; renderApp(); });
    reverseStringsBtn.addEventListener('click', handleReverseView);
    leftHandedBtn.addEventListener('click', handleLeftHandedToggle);
    editPlayModeSelect.addEventListener('change', handleInteractionChange);
    notesPerStringSelect.addEventListener('change', (e) => { if (state.currentScale) { handleShowScale(); } });
    setupSelect.addEventListener('change', handleSetupChange);
    zoomSlider.addEventListener('input', e => { fretboardWrapper.style.width = `${100 + e.target.value * 2}%`; });
    toggleScaleSetBtn.addEventListener('click', () => {
        state.isZeitlerMode = !state.isZeitlerMode;
        toggleScaleSetBtn.textContent = state.isZeitlerMode ? 'Show Basic Scales' : 'Show Zeitler Scales';
        zeitlerCredit.style.display = state.isZeitlerMode ? 'block' : 'none';
        updateTheoryDefinitions();
    });
    scaleSearchInput.addEventListener('input', updateScaleDropdown);
    alternativeVoicingBtn.addEventListener('click', handleShowAlternativeVoicing);
    fullscreenBtn.addEventListener('click', handleFullScreenToggle);
    screenshotBtn.addEventListener('click', handleScreenshot);
    
    // --- INITIALIZATION ---
    JSON.parse(ZEITLER_SCALES_RAW).forEach(scale => {
        ZEITLER_SCALE_DEFINITIONS[scale.name] = scale.steps;
    });
    
    const all12EDOScaleSteps = { ...SCALE_DEFINITIONS, ...ZEITLER_SCALE_DEFINITIONS };
    for(const scaleName in all12EDOScaleSteps) {
        ALL_SCALE_DEFINITIONS_FOR_RECOGNITION[scaleName] = stepsToIntervals(all12EDOScaleSteps[scaleName]);
    }

    // Initialize the Circle of Fifths module
    CircleOfFifths.init({
        state: state,
        dom: {
            cofSvg, cofLockBtn, cofLockIcon,
            cof19Svg, cof19LockBtn, cof19LockIcon,
            cof31Svg, cof31LockBtn, cof31LockIcon,
            rootNoteSelect, chordTypeSelect,
            currentRootDisplay, currentNotesDisplay
        },
        constants: {
            NOTE_NAMES, CHORD_DEFINITIONS, MINOR_SCALE_DIATONIC_CHORDS,
            MAJOR_SCALE_DIATONIC_CHORDS, DIATONIC_CHORDS_19, DIATONIC_CHORDS_31,
            EDO_SYSTEMS
        },
        helpers: {
            chordStepsToAbsoluteIntervals, midiToFrequency, getRootFrequency,
            frequencyToEdoInfo, findChordVoicing, findEdoVoicing
        },
        handlers: {
            handleShowChord, handleShowScale, renderApp
        },
        audio: AudioMidi.AudioPlayer
    });

    setTuning(6, 12, GUITAR_TUNING_HZ, GUITAR_GAUGES, 12); 
    updateTheoryDefinitions();
    renderIntervalColorPickers();

    TabEditor.setup({
        state: state,
        dom: { 
            tabGrid, tabPlayhead, tempoInput, textTabIo, midiFileInput, playTabBtn, 
            stopTabBtn, addTabColBtn, removeTabColBtn, importTextTabBtn, 
            exportTextTabBtn, exportMidiBtn 
        },
        helpers: { 
            calculateFrettedFrequency, frequencyToNoteName, frequencyToEdoInfo,
            frequencyToMidi, findFirstAvailableNoteLocation
        },
        audio: AudioMidi.AudioPlayer
    });
    
    // Initialize Audio and MIDI module, passing dependencies
    AudioMidi.setup({
        state: state,
        dom: {
            midiInSelect,
            midiOutSelect,
            masterVolumeSlider,
            soundTypeSelect,
        },
        helpers: {
            findFirstAvailableNoteLocation,
            midiToFrequency,
        },
        TabEditor: TabEditor
    });
    
    renderApp();

    // Apply initial zoom from the slider's default value
    fretboardWrapper.style.width = `${100 + parseInt(zoomSlider.value, 10) * 2}%`;

    // --- COLLAPSIBLE SECTIONS LOGIC ---
    document.querySelectorAll('.collapsible-header').forEach(header => {
        const content = header.nextElementSibling;
        if (content && content.classList.contains('collapsible-content')) {
            // If header has 'active' class, show content by default
            if(header.classList.contains('active')) {
                // Restore original display type based on element
                if(content.parentElement.classList.contains('control-section')) {
                    content.style.display = 'flex';
                } else {
                    content.style.display = 'block';
                }
            } else {
                 content.style.display = 'none';
            }


            header.addEventListener('click', () => {
                header.classList.toggle('active');
                if (content.style.display === 'none' || content.style.display === '') {
                     // Restore original display type based on element
                    if(content.parentElement.classList.contains('control-section')) {
                        content.style.display = 'flex';
                    } else {
                        content.style.display = 'block';
                    }
                } else {
                    content.style.display = 'none';
                }
            });
        }
    });

});
