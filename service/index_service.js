const IndexRepository = require("../repository/index_repository");


class IndexService {
    constructor() {
        this.index_repository = new IndexRepository()
    }

    async create_index(user_id, index_name) {
        const CreateRequest = {
            "user_id": user_id,
            "index_name": index_name
        }
        return await this.index_repository.create_index(CreateRequest);
    }

    async delete_index(user_id, index_name) {
        return await this.index_repository.delete_index(user_id, index_name);
    }

    async get_index_structure(user_id, index_name) {
        return await this.index_repository.get_index_structure(user_id, index_name);
    }

    async connect_user_database(user_id, driver, dsn, table, index_name) {
        const UserDBRequest = {
            "user_id": user_id,
            "driver": driver,
            "dsn": dsn,
            "table": table,
            "index_name": index_name
        }
        return await this.index_repository.connect_user_database(UserDBRequest);
    }
}

module.exports = IndexService;