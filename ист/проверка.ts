import {Response} from "express";
import {Разрешения, МодельСозданияВидео, МодельОбновленияВидео, полеОшибки, РезультатОшибкиПИП} from "./схемы";

function добавлениеОшибки(поле: string, сообщение: string, сообщенияОбОшибках: РезультатОшибкиПИП): void {
    сообщенияОбОшибках.errorsMessages.push({
        message: сообщение,
        field: поле
    });
}

function ошибкиВводаОбнов(тело: МодельОбновленияВидео, отв: Response): РезультатОшибкиПИП {
    const сообщОбОшибках: РезультатОшибкиПИП = {
        errorsMessages: []
    };

    function добОшибки(поле: string, сообщение: string): void {
        добавлениеОшибки(поле, сообщение, сообщОбОшибках);
    }

    if(!тело.canBeDownloaded) добОшибки("canBeDownloaded", "Отсутствует поле о разрешении скачивания видео");
    else if(typeof тело.canBeDownloaded !== "boolean") добОшибки("canBeDownloaded", "Поле о разрешении скачивания видео не является логическим значением");

    if(!тело.minAgeRestriction) добОшибки("minAgeRestriction", "Отсутствует поле минимального возрастного ограничения видео");
    else if(тело.minAgeRestriction !== null) {
        if(typeof тело.minAgeRestriction !== "number") добОшибки("minAgeRestriction", "Поле минимального возрастного ограничения видео не является числом");
        else if(!!(тело.minAgeRestriction % 1)) добОшибки("minAgeRestriction", "Минимальное возрастное ограничение видео не является целым числом");
        else if(тело.minAgeRestriction > 18) добОшибки("minAgeRestriction", "Минимальное возрастное ограничение видео не должно быть больше 18");
        else if(тело.minAgeRestriction < 1) добОшибки("minAgeRestriction", "Минимальное возрастное ограничение видео не должно быть меньше 1");
    }

    if(!тело.publicationDate) добОшибки("publicationDate", "Отсутствует дата публикации видео");
    else if(typeof тело.publicationDate !== "string") добОшибки("publicationDate", "Дата публикации видео не является строкой");
    else if(isNaN((new Date(тело.publicationDate)).getTime())) добОшибки("publicationDate", "Неверная дата публикации видео");

    return сообщОбОшибках;
}

function провВвода(тело: МодельСозданияВидео | МодельОбновленияВидео, отв: Response, сообщенияОбОшибках: РезультатОшибкиПИП | null): boolean {
    const сообщОбОшибках: РезультатОшибкиПИП = сообщенияОбОшибках ? сообщенияОбОшибках : {
        errorsMessages: []
    };

    function добОшибки(поле: string, сообщение: string): void {
        добавлениеОшибки(поле, сообщение, сообщОбОшибках);
    }

    if(!тело.title) добОшибки("title", "Отсутствует название видео");
    else if(typeof тело.title !== "string") добОшибки("title", "Название видео не является строкой");
    else if(тело.title.length > 40) добОшибки("title", "Название видео содержит больше 40 символов");
    else if(!тело.title.replace(/ /g, "")) добОшибки("title", "Пустое название видео");

    if(!тело.author) добОшибки("author", "Отсутствует имя автора видео");
    else if(typeof тело.author !== "string") добОшибки("author", "Имя автора видео не является строкой");
    else if(тело.author.length > 20) добОшибки("author", "Имя автора видео содержит больше 20 символов");
    else if(!тело.author.replace(/ /g, "")) добОшибки("author", "Пустое имя автора видео");
    
    if(!тело.availableResolutions) добОшибки("availableResolutions", "Отсутствуют доступные разрешения видео");
    else if(!Array.isArray(тело.availableResolutions)) добОшибки("availableResolutions", "Доступные разрешения видео не являются массивом");
    else if(!тело.availableResolutions.length) добОшибки("availableResolutions", "В массиве отсутствуют доступные разрешения видео");
    else if(!тело.availableResolutions.every(д => typeof д === "string")) добОшибки("availableResolutions", "Доступные разрешения видео не являются массивом строк");
    else if(!тело.availableResolutions.every(д => Разрешения[д])) добОшибки("availableResolutions", "В массиве содержатся недоступные разрешения видео");

    if(сообщОбОшибках.errorsMessages.length) {
        отв.status(400).json(сообщОбОшибках);
        return true;
    }
    return false;
}

export function провВводаСозданияВидео(тело: МодельСозданияВидео, отв: Response): boolean {
    return провВвода(тело, отв, null);
}

export function провВводаОбновленияВидео(тело: МодельОбновленияВидео, отв: Response): boolean {
    return провВвода(тело, отв, ошибкиВводаОбнов(тело, отв));
}
