import {Request} from "express";

export type ЗапросСПарами<П> = Request<П>;
export type ЗапросСТелом<Т> = Request<{}, {}, Т>;
export type ЗапросСВопросом<В> = Request<{}, {}, {}, В>;
export type ЗапросСПарамиИТелом<П, Т> = Request<П, {}, Т>;
