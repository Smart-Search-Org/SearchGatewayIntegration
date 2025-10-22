const LlmRepository = require("../repository/llm_repository");


class LlmService {
    constructor() {
        this.llm_repository = new LlmRepository()
    }

    async get_llm_response(userQuery) {
        return await this.llm_repository.get_llm_response(userQuery);
    }
}

module.exports = LlmService;