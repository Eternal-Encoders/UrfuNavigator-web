interface BuildingPhoto {
    names: string[],
    file: string,
    crop: string,
    fullName?: string,
    illustration?: 'guk' | 'irit-rtf',
    address?: string
}

const photos: BuildingPhoto[] = [
    { names: ['ГУК'], file: 'ecb85.png', crop: '', fullName: 'Главный учебный корпус', address: 'ул. Мира, 19' },
    { names: ['ИРИТ', 'РТФ'], file: '2a558.png', crop: 'photo-irit', fullName: 'Институт радиоэлектроники\nи информационных технологий', address: 'ул. Мира, 32' },
    { names: ['ФТИ'], file: 'efd77.png', crop: 'photo-fti', fullName: 'Физико-технологический институт', address: 'ул. Мира, 21' },
    { names: ['ИСА'], file: '3fdfb.png', crop: 'photo-isa' },
    { names: ['УРАЛЭНИН'], file: '7c32a.png', crop: '' },
    { names: ['ИНМИТ', 'ХТИ'], file: 'cd876.png', crop: '' },
    { names: ['ИНЭУ'], file: 'f5962.png', crop: 'photo-ineu' },
    { names: ['УГИ'], file: '6465b.png', crop: 'photo-ugi' },
];

export function buildingPhoto(name: string) {
    const match = photos.find(photo => photo.names.some(part => name.toUpperCase().includes(part)));
    if (!match) return undefined;
    const labels: Record<string, string> = { ИРИТ: 'ИРИТ-РТФ', ИНМИТ: 'ИнМИТ/ХТИ', УРАЛЭНИН: 'УралЭНИН', ИНЭУ: 'ИнЭУ' };
    return {
        src: `/remake/${match.file}`, crop: match.crop,
        fullName: match.fullName, address: match.address, illustration: match.illustration,
        label: labels[match.names[0]] ?? match.names[0], order: photos.indexOf(match)
    };
}
