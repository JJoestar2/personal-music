import "reflect-metadata"
import { MusicCategories, MusicCollection, Soundtrack } from "./entity";
import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
    type: 'mysql',
    host: "localhost",
    port: 3306,
    username: 'bohdan',
    password: 'password',
    database: 'test_nodejs',
    entities: [
        MusicCategories,
        MusicCollection,
        Soundtrack,
    ],
    synchronize: true,
    logging: false,
});

export {
    AppDataSource,
};