import Knex from "knex";
import { env } from "./env";
const KnexConfig = require("./knexfile");
export const knex = Knex(KnexConfig[env.NODE_ENV]);
