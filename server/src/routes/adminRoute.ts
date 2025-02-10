import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { //getClientHandler,
         withdrawHandlerByPId,
         withdrawHandlerByCardId,
         signInHandler,
         signUpHandler,
         deleteClientHandlerByPId,
         deleteClientHandlerByCardId 
} from '../handlers/adminHandler';
import { jwtParseMiddleware } from '../middlewares/authMiddleware';
const router = Router()
router.get('/sign-up', asyncHandler(signUpHandler))
router.get('/sign-in', asyncHandler(signInHandler))
//router.get('/get-client', jwtParseMiddleware, asyncHandler(getClientHandler))
router.post('/withdrawByPId', jwtParseMiddleware, asyncHandler(withdrawHandlerByPId)) // person Id
router.post('/withdrawByCardId', jwtParseMiddleware, asyncHandler(withdrawHandlerByCardId)) // card Id
router.delete('/delete-client-by-pId', jwtParseMiddleware, asyncHandler(deleteClientHandlerByPId)) // person Id
router.delete('/delete-client-by-cardId', jwtParseMiddleware, asyncHandler(deleteClientHandlerByCardId)) // card Id
module.exports = router