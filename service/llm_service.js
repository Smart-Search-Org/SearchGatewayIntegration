const LlmRepository = require("../repository/llm_repository");


class LlmService {
    constructor() {
        this.llm_repository = new LlmRepository()
    }

    async get_llm_response(userQuery, user_id) {
        return await this.llm_repository.get_llm_response(userQuery, user_id);
    }
}

module.exports = LlmService;