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
const JUST_INTONATION_TUNING_HZ = [82.5, 110.0, 146.67, 195.56, 244.44, 325.93]; // Based on pure ratios from A2=110Hz
const SAZ_TUNING_HZ = [98.00, 146.83, 220.00]; // G2-D3-A3 Common Saz Tuning
const SAZ_GAUGES = [0.025, 0.018, 0.012];
const SAZ_FRET_RATIOS = [1.0558, 1.1058, 1.1272, 1.1804, 1.2238, 1.2681, 1.3257, 1.3944, 1.4493, 1.4799, 1.5555, 1.6204, 1.6949, 1.7677, 1.8470, 1.9231, 2.0, 2.0771, 2.2082, 2.3026, 2.4390, 2.5362, 2.6820]; // Ratios for 23 frets
const SAZ_FRET_DEFINITIONS = [
    { name: "Pest Segâh", interval: "Komali 2'li" }, { name: "Pest Kürdi", interval: "Bakiye" }, { name: "Çargah", interval: "Küçük Mücennep" }, { name: "Neva", interval: "Büyük Mücennep" }, { name: "Hüseyni", interval: "Tanini" }, { name: "Acem", interval: "Artık 2'li" }, { name: "Eviç", interval: "Tam 4'lü" }, { name: "Mahur", interval: "Artık 4'lü" }, { name: "Gerdaniye", interval: "Eksik 5'li" }, { name: "Muhayyer", interval: "Tam 5'li" }, { name: "Sünbüle", interval: "Komali 6'lı" }, { name: "Zirgüle", interval: "Bakiye 6'lı" }, { name: "Şehnaz", interval: "K. Mücennep 6'lı" }, { name: "Saba", interval: "Eksik 7'li" }, { name: "Buselik", interval: "Küçük 7'li" }, { name: "Hicaz", interval: "Büyük 7'li" }, { name: "Nym Hicaz", interval: "Oktav" }, { name: "Tiz Neva", interval: "Oktav + B.Mücennep" }, { name: "Tiz Hüseyni", interval: "Oktav + Tanini" }, { name: "Tiz Acem", interval: "Oktav + Artık 2'li" }, { name: "Tiz Eviç", interval: "Oktav + Tam 4'lü" }, { name: "Tiz Gerdaniye", interval: "Oktav + Eksik 5'li" }, { name: "Tiz Muhayyer", interval: "Oktav + Tam 5'li" }
];
const JUST_INTONATION_RATIOS = [16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
const TRUE_TEMPERAMENT_OFFSETS_CENTS = [ [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, +12, +14, +12, +14, +12, +10, +14, +16, +14, +12, +14], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0], [0, -2, 0, -1, 0, -2, -4, 0, -2, 0, -1, 0] ];
const CHORD_DEFINITIONS = { 'Major': {steps:[4,3]},'Minor': {steps:[3,4]},'Diminished': {steps:[3,3]},'Augmented': {steps:[4,4]},'Dominant 7th': {steps:[4,3,3]},'Major 7th': {steps:[4,3,4]},'Minor 7th': {steps:[3,4,3]},'Major 6th': {steps:[4,3,2]},'Minor 6th': {steps:[3,4,2]}, 'Suspended 2nd': {steps:[2,5]},'Suspended 4th': {steps:[5,2]},'Major 9th': {steps:[4,3,4,3]},'Dominant 9th': {steps:[4,3,3,4]},'Minor 9th': {steps:[3,4,3,4]},'11th':{steps:[4,3,3,7]},'Dominant 13th':{steps:[4,3,3,4,7]},'Major 13th':{steps:[4,3,4,3,7]},'Minor 13th':{steps:[3,4,3,4,7]} };
const CHORD_DEFINITIONS_19 = { 'Major (19)': { steps: [6, 5] }, 'Minor (19)': { steps: [5, 6] }, 'Diminished (19)': { steps: [5, 5] }, 'Subminor (19)': { steps: [4, 7] }, 'Supermajor (19)': { steps: [7, 4] }, 'Diminished Seventh (19)': { steps: [5, 5, 5] } };
const CHORD_DEFINITIONS_24 = { 'Neutral (24)': { steps: [7, 7] } };
const CHORD_DEFINITIONS_31 = { 'Major (31)': { steps: [10, 8] }, 'minor (31)': { steps: [8, 10] }, 'Diminished (31)': { steps: [8, 8] }, 'Neutral (31)': { steps: [9, 9] }, 'Barbershop Seventh (31)': { steps: [10, 8, 7] }, 'I Supermajor Minor Seven (31)': { steps: [11, 7, 7] }, 'Septimal 11th (31)': { steps: [10, 5, 3, 7] }, 'Undecimal 11th (31)': { steps: [10, 4, 4, 7] }, 'Neutral Harmonic Seventh (31)': { steps: [9, 9, 7] }, 'Neutral Minor Seventh (31)': { steps: [9, 9, 8] }, 'Neutral Major Seventh (31)': { steps: [9, 9, 10] } };
const SCALE_DEFINITIONS_53 = { 'Uşşak': [5, 4, 4, 5, 4, 4, 2], 'Hüseyni': [9, 5, 4, 9, 5, 4, 7], 'Rast': [9, 8, 5, 9, 8, 5, 9], 'Hicaz': [5, 12, 5, 9, 4, 9, 9] };
// Canonical 24-EDO approximations of foundational Turkish makams.
const SCALE_DEFINITIONS_SAZ_24 = {
    'Rast (24-EDO)': [4, 3, 3, 4, 4, 3, 3],
    'Uşşak (24-EDO)': [3, 3, 4, 4, 3, 3, 4],
    'Hüseyni (24-EDO)': [4, 2, 4, 4, 2, 4, 4],
    'Hicaz (24-EDO)': [2, 6, 2, 4, 2, 4, 4]
};

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
    },
    53: {
        names: [ "R", "1c", "2c", "3c", "Koma Segah", "Kürdi", "6c", "7c", "Dik Kürdi", "Segah", "10c", "11c", "12c", "Buselik", "14c", "15c", "16c", "17c", "Çargah", "19c", "20c", "21c", "Saba", "23c", "24c", "25c", "Dik Saba", "27c", "28c", "29c", "30c", "Neva", "32c", "33c", "34c", "Hisar", "36c", "37c", "38c", "39c", "Hüseyni", "41c", "42c", "43c", "Acem", "45c", "46c", "47c", "48c", "Eviç", "50c", "51c", "Gerdaniye" ],
        intervals: [ "R", "1c", "2c", "3c", "Bakiye (4c)", "K.Mücennep (5c)", "6c", "7c", "B.Mücennep (8c)", "Tanini (9c)", "10c", "11c", "12c", "13c", "14c", "15c", "16c", "17c", "18c", "19c", "20c", "21c", "P4 (22c)", "23c", "24c", "25c", "A4 (26c)", "d5 (27c)", "28c", "29c", "30c", "P5 (31c)", "32c", "33c", "34c", "m6 (35c)", "M6 (36c)", "37c", "38c", "39c", "m7 (40c)", "41c", "42c", "43c", "M7 (44c)", "45c", "46c", "47c", "48c", "49c", "50c", "51c", "52c" ]
    }
};