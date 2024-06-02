import {пр} from "./прил";

const //МП = "127.0.0.1", // Адрес межсетевого протокола (МП)
порт = process.env.PORT || 3e3; // Порт, прослушиваемый сервером


пр.listen(порт, () => {
    console.log("Сервер доступен по адресу " + "МП" + " и случшает порт " + порт);
});
