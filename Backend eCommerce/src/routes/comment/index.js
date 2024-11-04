'use strict'

const express = require('express')
const CommentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()


//authentication
router.use(authentication)

//create comment
router.post('', asyncHandler(CommentController.createComment))
router.delete('', asyncHandler(CommentController.deleteComment))
router.get('', asyncHandler(commentController.getCommentByParentId))

module.exports = router