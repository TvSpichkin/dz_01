import {типВидео, МодельВидаВидео} from "./схемы";

export function бдВвид(бдЧаст: типВидео): МодельВидаВидео {
    return {
        id: бдЧаст.ид,
        title: бдЧаст.название,
        author: бдЧаст.автор,
        canBeDownloaded: бдЧаст.можноСкачать,
        minAgeRestriction: бдЧаст.минВозрастноеОграничение,
        createdAt: бдЧаст.созданВ,
        publicationDate: бдЧаст.датаПубликации,
        availableResolutions: бдЧаст.доступныеРазрешения
    };
}
