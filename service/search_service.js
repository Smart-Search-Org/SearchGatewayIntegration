const SearchRepository = require("../repository/search_repository");


class SearchService {
    constructor() {
        this.search_repository = new SearchRepository()
    }

    async get_search_response(index, llm_response) {
        const request_object = {
            "index_name": index,
            ...llm_response
        }
        return await this.search_repository.get_search_response(request_object);
    }
}

module.exports = SearchService;