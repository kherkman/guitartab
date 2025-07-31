// --- audio-midi.js ---

const AudioMidi = (() => {
    // --- PRIVATE VARIABLES ---
    let state, dom, helpers, TabEditor; // Dependencies from main-app.js
    const KEYBOARD_MAP = { 'a': 60, 'w': 61, 's': 62, 'e': 63, 'd': 64, 'f': 65, 't': 66, 'g': 67, 'y': 68, 'h': 69, 'u': 70, 'j': 71, 'k': 72 };

    // --- AUDIO SYNTHESIS ---
    const AudioPlayer = (() => {
        let audioCtx;
        let masterGain;

        // --- Sample-based audio settings ---
        const SAMPLE_CONFIG = {
            'acoustic': {
                files: ['guitar-note-1.wav', 'guitar-note-2.wav', 'guitar-note-3.wav', 'guitar-note-4.wav'],
                baseHz: 110.0 // All acoustic samples must have this base pitch
            },
            'distortion': {
                files: ['distguitar-note-1.wav', 'distguitar-note-2.wav'], // Add more distortion samples here
                baseHz: 110.0 // All distortion samples must have this base pitch
            }
        };

        let audioBuffers = {}; // Will store loaded buffers, e.g., audioBuffers.acoustic = [buffer1, buffer2]
        let currentSoundType = 'acoustic';
        let isInitialized = false;
        let isLoading = false;

        async function init() {
            if (isInitialized || isLoading) return;

            isLoading = true;
            if (!audioCtx) {
                try {
                    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
                    masterGain = audioCtx.createGain();
                    masterGain.connect(audioCtx.destination);
                    if (state) { // Check if state is initialized
                       setVolume(state.masterVolume);
                    }
                } catch (e) {
                    console.error("Could not create AudioContext.", e);
                    isLoading = false;
                    return;
                }
            }

            console.log("Loading all sound sets...");
            for (const type in SAMPLE_CONFIG) {
                const config = SAMPLE_CONFIG[type];
                audioBuffers[type] = []; // Initialize array for this type
                
                const loadPromises = config.files.map(async (file) => {
                    try {
                        const response = await fetch(file);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        const arrayBuffer = await response.arrayBuffer();
                        return await audioCtx.decodeAudioData(arrayBuffer);
                    } catch (error) {
                        console.warn(`Could not load or decode sample: ${file}. It will be skipped.`);
                        return null;
                    }
                });

                const loaded = await Promise.all(loadPromises);
                audioBuffers[type] = loaded.filter(b => b !== null); // Store only successfully loaded buffers

                if (audioBuffers[type].length > 0) {
                    console.log(`Loaded ${audioBuffers[type].length}/${config.files.length} samples for '${type}' sound.`);
                } else {
                    console.warn(`No samples loaded for '${type}' sound. It will fall back to synth.`);
                }
            }
            
            isInitialized = true;
            isLoading = false;
            console.log("Audio loading complete.");
        }

        function playNoteSynth(frequency, time) {
            if (!audioCtx || frequency <= 0) return;
            const now = audioCtx.currentTime;
            const startTime = now + time;
            const gain = 0.3;
            const envelope = audioCtx.createGain();
            envelope.connect(masterGain);
            envelope.gain.setValueAtTime(0, startTime);
            envelope.gain.linearRampToValueAtTime(gain, startTime + 0.02);
            envelope.gain.exponentialRampToValueAtTime(gain * 0.5, startTime + 0.2);
            envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.5);
            const osc1 = audioCtx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = frequency; osc1.connect(envelope);
            [2, 3, 4].forEach((multiple, i) => { const osc = audioCtx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = frequency * multiple; const oscGain = audioCtx.createGain(); oscGain.gain.value = gain / (multiple + i * 2); osc.connect(oscGain); oscGain.connect(envelope); osc.start(startTime); osc.stop(startTime + 1.5); });
            osc1.start(startTime); osc1.stop(startTime + 2);
        }

        async function playNote(frequency, time) {
            await init();
            
            if (!audioCtx || frequency <= 0) return;

            const buffersForCurrentType = audioBuffers[currentSoundType];
            
            if (!buffersForCurrentType || buffersForCurrentType.length === 0) {
                playNoteSynth(frequency, time);
                return;
            }
            
            const now = audioCtx.currentTime;
            const startTime = now + time;
            
            const randomIndex = Math.floor(Math.random() * buffersForCurrentType.length);
            const selectedBuffer = buffersForCurrentType[randomIndex];
            const source = audioCtx.createBufferSource();
            source.buffer = selectedBuffer;

            const baseHz = SAMPLE_CONFIG[currentSoundType].baseHz;
            const cents = 1200 * Math.log2(frequency / baseHz);
            source.detune.value = cents;

            const envelope = audioCtx.createGain();
            envelope.gain.setValueAtTime(0, startTime);
            envelope.gain.linearRampToValueAtTime(1.0, startTime + 0.02);
            envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.0);

            source.connect(envelope);
            envelope.connect(masterGain);
            
            source.start(startTime);
        }

        function playSequence(frequencies, delay = 0.08) {
            frequencies.forEach((freq, i) => { if (freq) playNote(freq, i * delay); });
        }

        function setVolume(level) {
            if (masterGain) {
                masterGain.gain.setTargetAtTime(level, audioCtx.currentTime, 0.01);
            }
        }

        function setSoundType(type) {
            if (SAMPLE_CONFIG[type]) {
                console.log(`Sound type changed to: ${type}`);
                currentSoundType = type;
            } else {
                console.warn(`Attempted to set unknown sound type: ${type}`);
            }
        }

        return { init, playNote, playSequence, setVolume, setSoundType };
    })();

    // --- MIDI & KEYBOARD ---
    function initMidi() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
        } else { console.warn("Web MIDI API not supported in this browser."); }
    }

    function onMIDISuccess(midiAccess) {
        state.midiAccess = midiAccess;
        state.midiInputs = Array.from(midiAccess.inputs.values());
        state.midiOutputs = Array.from(midiAccess.outputs.values());
        populateMidiDropdowns();
        midiAccess.onstatechange = onMIDIStateChange;
    }

    function onMIDIFailure() { console.error('Could not access your MIDI devices.'); }

    function onMIDIStateChange() {
        if (!state.midiAccess) return;
        state.midiInputs = Array.from(state.midiAccess.inputs.values());
        state.midiOutputs = Array.from(state.midiAccess.outputs.values());
        populateMidiDropdowns();
    }

    function populateMidiDropdowns() {
        dom.midiInSelect.innerHTML = '<option value="">None</option>';
        dom.midiOutSelect.innerHTML = '<option value="">None</option>';
        state.midiInputs.forEach(input => dom.midiInSelect.innerHTML += `<option value="${input.id}">${input.name}</option>`);
        state.midiOutputs.forEach(output => dom.midiOutSelect.innerHTML += `<option value="${output.id}">${output.name}</option>`);
        dom.midiInSelect.value = state.selectedMidiInId || "";
        dom.midiOutSelect.value = state.selectedMidiOutId || "";
    }

    function handleMidiInChange(e) {
        const selectedId = e.target.value;
        if (state.selectedMidiInId) { const oldInput = state.midiAccess.inputs.get(state.selectedMidiInId); if (oldInput) oldInput.onmidimessage = null; }
        state.selectedMidiInId = selectedId;
        if (selectedId) { const newInput = state.midiAccess.inputs.get(selectedId); if (newInput) newInput.onmidimessage = handleMidiMessage; }
    }

    function handleMidiMessage(event) {
        const command = event.data[0] >> 4;
        const note = event.data[1];
        const velocity = event.data.length > 2 ? event.data[2] : 0;
        if (command === 9 && velocity > 0) { handleNoteOn(note, velocity); }
        else if (command === 8 || (command === 9 && velocity === 0)) { handleNoteOff(note); }
    }

    function handleNoteOn(midiNote, velocity) {
        if (state.activeMidiNotes.has(midiNote)) return;
        const location = helpers.findFirstAvailableNoteLocation(midiNote);
        if (location) {
            const fretSpaceEl = document.querySelector(`.fret-space[data-string-index='${location.string}'][data-fret-index='${location.fret}']`);
            if (fretSpaceEl) {
                fretSpaceEl.classList.add('note-active');
                state.activeMidiNotes.set(midiNote, fretSpaceEl);
            }
        }
        AudioPlayer.playNote(helpers.midiToFrequency(midiNote), 0);
        if (state.selectedMidiOutId) { const output = state.midiAccess.outputs.get(state.selectedMidiOutId); if (output) output.send([0x90, midiNote, velocity]); }
    }

    function handleNoteOff(midiNote) {
        if (state.activeMidiNotes.has(midiNote)) {
            const fretSpaceEl = state.activeMidiNotes.get(midiNote);
            fretSpaceEl.classList.remove('note-active');
            state.activeMidiNotes.delete(midiNote);
        }
        if (state.selectedMidiOutId) { const output = state.midiAccess.outputs.get(state.selectedMidiOutId); if (output) output.send([0x80, midiNote, 0]); }
    }

    function handleKeyDown(e) {
        if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        if (TabEditor.handleKeyDown(e)) {
            return; 
        }
        const midiNote = KEYBOARD_MAP[e.key];
        if (midiNote && !state.activeMidiNotes.has(midiNote)) {
            handleNoteOn(midiNote, 100);
        }
    }

    function handleKeyUp(e) { 
        if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return; 
        const midiNote = KEYBOARD_MAP[e.key]; 
        if (midiNote) { 
            handleNoteOff(midiNote); 
        } 
    }

    // --- INITIALIZATION ---
    function setup(dependencies) {
        // Store dependencies passed from main-app
        state = dependencies.state;
        dom = dependencies.dom;
        helpers = dependencies.helpers;
        TabEditor = dependencies.TabEditor;

        // Initialize MIDI and Audio
        initMidi();
        AudioPlayer.init();
        
        // Attach event listeners owned by this module
        dom.midiInSelect.addEventListener('change', handleMidiInChange);
        dom.midiOutSelect.addEventListener('change', e => { state.selectedMidiOutId = e.target.value; });
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        dom.masterVolumeSlider.addEventListener('input', e => { 
            const newVolume = parseFloat(e.target.value) / 100;
            state.masterVolume = newVolume;
            AudioPlayer.init(); // ensure context is there
            AudioPlayer.setVolume(newVolume);
        });
        dom.soundTypeSelect.addEventListener('change', (e) => {
            AudioPlayer.setSoundType(e.target.value);
            // Play a test note to confirm the sound change
            AudioPlayer.playNote(helpers.midiToFrequency(60), 0); // Play a C4
        });
    }

    // --- PUBLIC INTERFACE ---
    return {
        setup: setup,
        AudioPlayer: AudioPlayer, // Expose the AudioPlayer object
        // No need to expose handlers like handleKeyDown directly as they are attached internally
    };
})();