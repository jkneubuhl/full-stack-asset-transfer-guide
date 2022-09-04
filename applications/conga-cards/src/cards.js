export const WORKSHOP_CARDS = [
    make(124, 'blockbert',        'Blockbert'),
    make(125, 'count-blockula',   'Count Blockula'),
    make(126, 'no-pun-intended',  'No Pun Intended'),
    make(127, 'darth-conga',      'Darth Conga'),
    make(128, 'block-norris',     'Block Norris'),
    make(129, 'appleplectic',     'Appleplectic'),
    make(130, 'bananomatopoeia',  'Bananomatopoeia'),
    make(131, 'freendly',         'Yoox'),
];

function make(number, congaId, displayName) {
    return {
        name: `#${number} ${displayName}`,
        value: congaId,
    };
}
