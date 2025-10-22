const SearchRepository = require("../repository/search_repository");


class SearchService {
    constructor() {
        this.search_repository = new SearchRepository()
    }

    async get_search_response(user_id, index, llm_response) {
        const request_object = {
            "user_id": user_id,
            "index_name": index,
            ...llm_response
        }
        return await this.search_repository.get_search_response(request_object);
    }
}

module.exports = SearchService;