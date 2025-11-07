
// src/routes/colectas.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { createColecta } = require('../controllers/colectas.controller');

const router = express.Router();

router.post(
  '/',
  [
    body('titulo').isString().notEmpty(),
    body('descripcion').optional().isString(),
    body('objetivo').isFloat({ gt: 0 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const result = await createColecta(req.db, req.body);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
