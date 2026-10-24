interface BuildingPhoto {
    names: string[],
    fullName?: string,
    expandedTitle?: string,
    address?: string
}

const photos: BuildingPhoto[] = [
    { names: ['ГУК'], expandedTitle: 'ГУК (ГУК, Э, И, М)', fullName: 'Главный учебный корпус', address: 'ул. Мира, 19' },
    { names: ['ИРИТ', 'РТФ'], expandedTitle: 'ИРИТ-РТФ (Р)', fullName: 'Институт радиоэлектроники\nи информационных технологий', address: 'ул. Мира, 32' },
    { names: ['ФТИ'], fullName: 'Физико-технологический институт', address: 'ул. Мира, 21' },
    { names: ['ИСА'], expandedTitle: 'ИСА (С, СП)',
        fullName: 'Институт строительства и архитектуры', address: 'ул. Мира, 17' },
    { names: ['УРАЛЭНИН'], expandedTitle: 'УралЭНИН (Т)',
        fullName: 'Уральский энергетический институт', address: 'ул. Софьи Ковалевской, 5' },
    { names: ['ИНМИТ'], expandedTitle: 'ИНМиТ (МТ)',
        fullName: 'Институт новых материалов и технологий', address: 'ул. Мира, 28' },
    { names: ['ХТИ'], expandedTitle: 'ХТИ (Х)',
        fullName: 'Химико-технологический институт', address: 'ул. Мира, 28' },
    { names: ['ИНФО'], expandedTitle: 'ИнФО (Т)',
        fullName: 'Институт фундаментального образования', address: 'ул. Софьи Ковалевской, 5' },
    { names: ['ИНЭУ'] },
    { names: ['УГИ'] },
];

export function buildingPhoto(name: string) {
    const match = photos.find(photo => photo.names.some(part => name.toUpperCase().includes(part)));
    if (!match) return undefined;
    const labels: Record<string, string> = { ИРИТ: 'ИРИТ-РТФ', ИНМИТ: 'ИНМиТ', ИНФО: 'ИнФО', УРАЛЭНИН: 'УралЭНИН', ИНЭУ: 'ИнЭУ' };
    return {
        expandedTitle: match.expandedTitle, fullName: match.fullName,
        address: match.address,
        label: labels[match.names[0]] ?? match.names[0], order: photos.indexOf(match)
    };
}
