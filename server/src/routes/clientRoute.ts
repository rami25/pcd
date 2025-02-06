import asyncHandler from 'express-async-handler';
import { Router } from "express";
import { signClientHandler } from '../handlers/clientHandler';

const router = Router()
router.post('/sign', asyncHandler(signClientHandler))
module.exports = router