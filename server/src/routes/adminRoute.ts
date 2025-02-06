import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { getClientHandler,
         withdrawHandler,
         signInHandler,
         deleteClientHandler 
} from '../handlers/adminHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
const router = Router()
router.post('/sign-in', asyncHandler(signInHandler))
router.get('/get-client', jwtParseMiddleware, asyncHandler(getClientHandler))
router.post('/withdraw', jwtParseMiddleware, asyncHandler(withdrawHandler))
router.delete('/delete-client', jwtParseMiddleware, asyncHandler(deleteClientHandler))
module.exports = router