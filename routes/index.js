const express = require('express');
const { keycloak } = require("../app");
const IndexService = require("../service/index_service");


module.exports = (keycloak) => {
    const router = express.Router();
    const index_service = new IndexService();

    router.post('/index', keycloak.protect(), async (req, res) => {
        try {
            const user_id = req.kauth.grant.access_token.content.sub;
            const index_name = req.body.index_name;
            if (!index_name) return res.status(400).json({ error: 'Missing "index_name"' });

            const index_response = await index_service.create_index(user_id, index_name);
            res.status(200).json({ index_response });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    });

    router.delete('/index', keycloak.protect(), async (req, res) => {
        try {
            const user_id = req.kauth.grant.access_token.content.sub;
            const index_name = req.query.indexName;
            if (!index_name) return res.status(400).json({ error: 'Missing "index_name"' });

            const index_response = await index_service.delete_index(user_id, index_name);
            res.status(204).json({ index_response });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    });

    router.get('/index-structure', keycloak.protect(), async (req, res) => {
        try {
            const user_id = req.kauth.grant.access_token.content.sub;
            const index_name = req.query.indexName;
            if (!index_name) return res.status(400).json({ error: 'Missing "index_name"' });

            const index_response = await index_service.get_index_structure(user_id, index_name);
            res.status(200).json({ index_response });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    });

    router.post('/index/docs', keycloak.protect(), async (req, res) => {
        try {
            const user_id = req.kauth.grant.access_token.content.sub;
            const { driver, dsn, table, index_name } = req.body;

            if (!driver || !dsn || !table || !index_name) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const index_response = await index_service.connect_user_database(user_id, driver, dsn, table, index_name);
            res.status(200).json({ index_response });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    });

    return router;
};
