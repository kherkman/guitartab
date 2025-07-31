const ALTERNATIVE_VOICING_LIBRARY = {
    'A': {
        'Major 6th': [{ fret: null, finger: 'X' }, { fret: -1, finger: 'O' }, { fret: 1, finger: '1' }, { fret: 1, finger: '2' }, { fret: 1, finger: '3' }, { fret: 1, finger: '4' }],
        'Dominant 9th': [{ fret: null, finger: 'X' }, { fret: -1, finger: 'O' }, { fret: 1, finger: '1' }, { fret: 3, finger: '3' }, { fret: 1, finger: '2' }, { fret: 2, finger: '4' }],
        'Diminished': [{ fret: null, finger: 'X' }, { fret: -1, finger: 'O' }, { fret: 0, finger: '1' }, { fret: 1, finger: '2' }, { fret: 0, finger: '1' }, { fret: 1, finger: '3' }],
        'Augmented': [{ fret: null, finger: 'X' }, { fret: -1, finger: 'O' }, { fret: 2, finger: '3' }, { fret: 1, finger: '2' }, { fret: 1, finger: '1' }, { fret: 0, finger: 'T' }]
    },
    'A#': { // Bb
        'Major 6th': [{ fret: null, finger: 'X' }, { fret: 0, finger: '1' }, { fret: 2, finger: '2' }, { fret: 2, finger: '3' }, { fret: 2, finger: '4' }, { fret: 2, finger: '1' }],
        'Dominant 9th': [{ fret: null, finger: 'X' }, { fret: 0, finger: '1' }, { fret: 2, finger: '1' }, { fret: 0, finger: '2' }, { fret: 2, finger: '4' }, { fret: 0, finger: '1' }],
        'Minor 7th': [{ fret: null, finger: 'X' }, { fret: 0, finger: '1' }, { fret: 2, finger: '1' }, { fret: 0, finger: '1' }, { fret: 1, finger: '2' }, { fret: 0, finger: '1' }],
        'Diminished': [{ fret: null, finger: 'X' }, { fret: 0, finger: '1' }, { fret: 1, finger: '2' }, { fret: 2, finger: '3' }, { fret: 1, finger: '2' }, { fret: -1, finger: 'O' }],
        'Augmented': [{ fret: null, finger: 'X' }, { fret: 0, finger: '1' }, { fret: -1, finger: 'O' }, { fret: 2, finger: '3' }, { fret: 2, finger: '2' }, { fret: 1, finger: '1' }]
    },
    'B': {
        'Major 6th': [{ fret: null, finger: 'X' }, { fret: 1, finger: '1' }, { fret: 3, finger: '2' }, { fret: 3, finger: '3' }, { fret: 3, finger: '4' }, { fret: 3, finger: '1' }],
        'Augmented': [{ fret: null, finger: 'X' }, { fret: 1, finger: '2' }, { fret: 0, finger: '1' }, { fret: -1, finger: 'O' }, { fret: -1, finger: 'O' }, { fret: 2, finger: '3' }]
    },
    'C': {
        'Major 6th': [{ fret: null, finger: 'X' }, { fret: 2, finger: '3' }, { fret: 1, finger: '2' }, { fret: 1, finger: '1' }, { fret: 0, finger: '1' }, { fret: -1, finger: 'O' }],
        'Dominant 7th': [{ fret: null, finger: 'X' }, { fret: 2, finger: '2' }, { fret: 1, finger: '1' }, { fret: 2, finger: '3' }, { fret: 0, finger: 'O' }, { fret: -1, finger: 'O' }],
        'Dominant 9th': [{ fret: null, finger: 'X' }, { fret: 2, finger: '2' }, { fret: 1, finger: '1' }, { fret: 2, finger: '3' }, { fret: 2, finger: '4' }, { fret: 2, finger: '4' }],
        'Minor 6th': [{ fret: null, finger: 'X' }, { fret: 2, finger: '2' }, { fret: 0, finger: '1' }, { fret: 1, finger: '3' }, { fret: 0, finger: '1' }, { fret: 2, finger: '4' }],
        'Augmented': [{ fret: null, finger: 'X' }, { fret: 2, finger: '3' }, { fret: 1, finger: '2' }, { fret: 0, finger: '1' }, { fret: 0, finger: '1' }, { fret: -1, finger: 'O' }],
        'Suspended 4th': [{ fret: null, finger: 'X' }, { fret: 2, finger: '3' }, { fret: 2, finger: '4' }, { fret: -1, finger: 'O' }, { fret: 0, finger: '1' }, { fret: 0, finger: '1' }]
    },
    'C#': { // Db
        'Major 6th': [{ fret: null, finger: 'X' }, { fret: 3, finger: '1' }, { fret: 5, finger: '2' }, { fret: 5, finger: '3' }, { fret: 5, finger: '4' }, { fret: 5, finger: '1' }],
        'Augmented': [{ fret: null, finger: 'X' }, { fret: 3, finger: '2' }, { fret: 2, finger: '1' }, { fret: 1, finger: '1' }, { fret: 1, finger: '1' }, { fret: null, finger: 'X' }]
    },
    'D#': { // Eb
        'Major 6th': [{ fret: null, finger: 'X' }, { fret: 5, finger: '1' }, { fret: 7, finger: '2' }, { fret: 7, finger: '3' }, { fret: 7, finger: '4' }, { fret: 7, finger: '1' }],
        'Diminished': [{ fret: null, finger: 'X' }, { fret: 5, finger: '1' }, { fret: 6, finger: '2' }, { fret: 7, finger: '4' }, { fret: 6, finger: '3' }, { fret: null, finger: 'X' }],
        'Augmented': [{ fret: null, finger: 'X' }, { fret: 5, finger: '2' }, { fret: 4, finger: '1' }, { fret: 3, finger: '1' }, { fret: 3, finger: '1' }, { fret: null, finger: 'X' }]
    },
    'E': {
        'Augmented': [{ fret: -1, finger: 'O' }, { fret: 2, finger: '2' }, { fret: 1, finger: '1' }, { fret: 0, finger: '1' }, { fret: 0, finger: '1' }, { fret: -1, finger: 'O' }]
    }
};