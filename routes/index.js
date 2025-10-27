const express = require('express');
const indexService = require('../service/index_service');
const authApi = require('../middlewares/auth_app');
const router = express.Router();

index_service = new indexService();

router.post('/index', authApi, async function (req, res, next) {
    try {
        const user_id = req.user._id;
        const index_name = req.body.index_name;

        if (!index_name) {
            console.error('Error in /index route: missing "index_name" in request body');
            return res.status(400).json({ error: 'Missing "index_name" in request body' });
        }

        const index_response = await index_service.create_index(user_id, index_name);

        res.status(200).json({ index_response });

    } catch (error) {
        console.error('Error in /signup route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/index', authApi, async function (req, res, next) {
    try {
        const user_id = req.user._id;
        const index_name = req.query.indexName;

        if (!index_name) {
            console.error('Error in /index route: missing "index_name" in request body');
            return res.status(400).json({ error: 'Missing "index_name" in request body' });
        }

        const index_response = await index_service.delete_index(user_id, index_name);

        res.status(204).json({ index_response });

    } catch (error) {
        console.error('Error in /signup route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/index-structure', authApi, async function (req, res, next) {
    try {
        const user_id = req.user._id;
        const index_name = req.query.indexName;

        if (!index_name) {
            console.error('Error in /index route: missing "index_name" in request body');
            return res.status(400).json({ error: 'Missing "index_name" in request body' });
        }

        const index_response = await index_service.get_index_structure(user_id, index_name);

        res.status(200).json({ index_response });

    } catch (error) {
        console.error('Error in /signup route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.post('/index/docs', authApi, async function (req, res, next) {
    try {
        const user_id = req.user._id;
        const driver = req.body.driver;
        const dsn = req.body.dsn;
        const table = req.body.table;
        const index_name = req.body.index_name;

        if (!driver) {
            console.error('Error in /index route: missing "driver" in request body');
            return res.status(400).json({ error: 'Missing "driver" in request body' });
        }
        if (!dsn) {
            console.error('Error in /index route: missing "dsn" in request body');
            return res.status(400).json({ error: 'Missing "dsn" in request body' });
        }
        if (!table) {
            console.error('Error in /index route: missing "table" in request body');
            return res.status(400).json({ error: 'Missing "table" in request body' });
        }
        if (!index_name) {
            console.error('Error in /index route: missing "index_name" in request body');
            return res.status(400).json({ error: 'Missing "index_name" in request body' });
        }

        const index_response = await index_service.connect_user_database(user_id, driver, dsn, table, index_name);

        res.status(200).json({ index_response });

    } catch (error) {
        console.error('Error in /signup route:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
