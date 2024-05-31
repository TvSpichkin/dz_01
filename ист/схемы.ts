export enum Разрешения {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
};

export type СтрокаРазрешения = keyof typeof Разрешения;

export type типВидео = {
    ид: number,
    название: string,
    автор: string,
    можноСкачать: boolean,
    минВозрастноеОграничение: number | null,
    созданВ: string,
    датаПубликации: string,
    доступныеРазрешения: СтрокаРазрешения[]
};

export type МодельВидаВидео = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: СтрокаРазрешения[]
};

export type МодельЗапросаВидео = {
    /**
     * Это название должно быть включено в полное название искомых видео
     */
    title: string
};

export type МодельУИРПарамовИдВидео = {
    /**
     * ид существующего видео
     */
    id: number
};

export type МодельСозданияВидео = {
    /**
     * Название, автор и возможные разрешения видео
     */
    title: string,
    author: string,
    availableResolutions: СтрокаРазрешения[]
};

export type МодельОбновленияВидео = {
    /**
     * Название, автор и возможные разрешения видео
     */
    title: string,
    author: string,
    availableResolutions: СтрокаРазрешения[],
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
};

export type полеОшибки = {
    /**
     * Сообщение с объяснением ошибки для определенного поля и в каком поле/свойстве входной модели имеется ошибка
     */
    message: string,
    field: string
};

export type РезультатОшибкиПИП = {
    errorsMessages: полеОшибки[]
};
