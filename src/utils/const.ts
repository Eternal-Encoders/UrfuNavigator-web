const InstColors = new Map<string, string>();
InstColors.set("ИРИТ-РТФ", "#265D93");
InstColors.set("ГУК", "#E77011");
InstColors.set("УРАЛЭНИН", "#46296A");
InstColors.set("ИНМИТ-ХТИ", "#68A357");
InstColors.set("ИСА", "#A02B09");
InstColors.set("УГИ", "#662B73");

// InstColors.set("ИНМТ", "#55211D");
// InstColors.set("ИНФО", "#090159");
// InstColors.set("ИНЭУ", "#007180");


const InstLinks = new Map<string, string>();
InstLinks.set("ИРИТ-РТФ", "/irit");
InstLinks.set("ИСА", "/isa");
InstLinks.set("ГУК", "/guk");
InstLinks.set("УРАЛЭНИН", "/uralenin");
InstLinks.set("ИНМИТ-ХТИ", "/inmit-hti");
InstLinks.set("УГИ", "/ugi");

// InstLinks.set("ИНЭУ", "/ineu");
// InstLinks.set("ИНМТ", "/inmt");


enum PointSearchTyping {
    start = "Откуда",
    end = "Куда",
    homePageText = "Поиск аудиторий и мест",
    none = ""
}

export { 
    InstColors, 
    InstLinks,  
    PointSearchTyping 
}