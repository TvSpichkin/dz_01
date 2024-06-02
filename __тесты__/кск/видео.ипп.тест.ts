import запрос = require("supertest"); // костыль от "can only be default-imported using the 'esModuleInterop' flag"
// import запрос from "supertest";
import {пр, путь} from "../../ист/прил";
import {СтрокаРазрешения, МодельВидаВидео, МодельСозданияВидео, МодельОбновленияВидео} from "../../ист/схемы";

describe("/видео", () => {
    function создВидео(название: string, автор: string, доступныеРазрешения: СтрокаРазрешения[]): МодельСозданияВидео {
        return {
            title: название,
            author: автор,
            availableResolutions: доступныеРазрешения
        };
    }
    function обнВидео(название: string, автор: string, доступныеРазрешения: СтрокаРазрешения[], можноСкачать: boolean, минВозрастноеОграничение: number | null, датаПубликации: string): МодельОбновленияВидео {
        return {
            title: название,
            author: автор,
            availableResolutions: доступныеРазрешения,
            canBeDownloaded: можноСкачать,
            minAgeRestriction: минВозрастноеОграничение,
            publicationDate: датаПубликации
        };
    }

    const э = "Электрон",
        п = "Позитрон",
        ф = "Фотон",
        Ли = "Лифшиц",
        Ла = "Ландау";
    var созданноеВидео1: МодельВидаВидео, созданноеВидео2: МодельВидаВидео;
    
    beforeAll(async () => {
        await запрос(пр).delete(путь.тест);
    });
    
    it("должен вернуть 200 и пустой массив", async () => {
        await запрос(пр).get(путь.видео).expect(200, []);
    });

    it("должен вернуть 404 для несуществующего видео", async () => {
        await запрос(пр).get(путь.видео + "/-1").expect(404);
    });

    it("не должен создать видео c неправильными входными данными", async () => {
        const видео: МодельСозданияВидео = создВидео(п, Ли, ["P144"]);
        
        await запрос(пр).post(путь.видео).expect(400);
        await запрос(пр).get(путь.видео).expect(200, []);

        await запрос(пр).post(путь.видео).send().expect(400);
        await запрос(пр).get(путь.видео).expect(200, []);

        await запрос(пр).post(путь.видео).send({название: 0}).expect(400);
        await запрос(пр).get(путь.видео).expect(200, []);

        await запрос(пр).post(путь.видео).send({...видео, title: undefined}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, title: 0}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, title: "qwertyuiop[]asdfghjkl;'zxcvbnm,./12345678"}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, title: "    "}).expect(400);
        await запрос(пр).get(путь.видео).expect(200, []);

        await запрос(пр).post(путь.видео).send({...видео, author: undefined}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, author: 0}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, author: "qwertyuiop[]asdfghjkl"}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, author: "    "}).expect(400);
        await запрос(пр).get(путь.видео).expect(200, []);

        await запрос(пр).post(путь.видео).send({...видео, availableResolutions: undefined}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, availableResolutions: 0}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, availableResolutions: []}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, availableResolutions: [0]}).expect(400);
        await запрос(пр).post(путь.видео).send({...видео, availableResolutions: ["0"]}).expect(400);
        await запрос(пр).get(путь.видео).expect(200, []);
    });

    it("должен создать видео c правильными входными данными", async () => {
        созданноеВидео1 = (await запрос(пр).post(путь.видео).send(создВидео(п, Ли, ["P144"])).expect(201)).body;
        expect(созданноеВидео1).toEqual({
            id: 0,
            title: п,
            author: Ли,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ["P144"]
        });

        созданноеВидео2 = (await запрос(пр).post(путь.видео).send(создВидео(ф, Ли, ["P144"])).expect(201)).body;
        expect(созданноеВидео2).toEqual({
            id: 1,
            title: ф,
            author: Ли,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ["P144"]
        });

        await запрос(пр).get(путь.видео).expect(200, [созданноеВидео1, созданноеВидео2]);
    });

    it("должен вернуть 200 и созданные видео", async () => {
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);
        await запрос(пр).get(путь.видео + "/1").expect(200, созданноеВидео2);
    });

    it("не должен обновить видео c неправильными входными данными", async () => {
        const дата: string = new Date().toISOString(),
        видео: МодельОбновленияВидео = обнВидео(э, Ла, ["P240"], !0, 6, дата);

        await запрос(пр).put(путь.видео + "/0").expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send().expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({название: 0}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({...видео, title: undefined}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, title: 0}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, title: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя01234567"}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, title: "    "}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({...видео, author: undefined}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, author: 0}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, author: "абвгдеёжзийклмнопрсту"}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, author: "    "}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({...видео, availableResolutions: undefined}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, availableResolutions: 0}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, availableResolutions: []}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, availableResolutions: [0]}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, availableResolutions: ["0"]}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({...видео, canBeDownloaded: undefined}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, canBeDownloaded: 0}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({...видео, minAgeRestriction: undefined}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, minAgeRestriction: "0"}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, minAgeRestriction: 1.5}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, minAgeRestriction: 19}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, minAgeRestriction: 0}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);

        await запрос(пр).put(путь.видео + "/0").send({...видео, publicationDate: undefined}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, publicationDate: 0}).expect(400);
        await запрос(пр).put(путь.видео + "/0").send({...видео, publicationDate: "ё"}).expect(400);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);
    });

    it("не должен обновить несуществующее видео", async () => {
        const дата: string = new Date().toISOString(),
        видео: МодельОбновленияВидео = обнВидео(э, Ла, ["P240"], !0, 6, дата);
        await запрос(пр).put(путь.видео + "/-1").send(видео).expect(404);
    });

    it("должен обновить видео c правильными входными данными", async () => {
        const дата: string = new Date().toISOString(),
        видео: МодельОбновленияВидео = обнВидео(э, Ла, ["P240"], !0, 6, дата);
        созданноеВидео1 = {...созданноеВидео1, ...видео};
        await запрос(пр).put(путь.видео + "/0").send(видео).expect(204);
        await запрос(пр).get(путь.видео + "/0").expect(200, созданноеВидео1);
        await запрос(пр).get(путь.видео + "/1").expect(200, созданноеВидео2);
    });

    it("не должен удалить несуществующее видео", async () => {
        await запрос(пр).delete(путь.видео + "/-1").expect(404);
    });

    it("должен удалить существующее видео", async () => {
        await запрос(пр).delete(путь.видео + "/0").expect(204);
        await запрос(пр).delete(путь.видео + "/1").expect(204);

        await запрос(пр).get(путь.видео).expect(200, []);
    });
});
