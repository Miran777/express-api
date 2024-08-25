const express = require('express')
const router = express.Router()
const multer = require('multer')
const authenticateToken = require('../middleware/auth')
const { PostController, UserController, CommentController, LikeController, FollowController } = require('../controllers')

const uploadDestination = 'uploads'

// Показываем, где хранить файлы
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploads = multer({
    storage: storage
})
// Роуты пользователя
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.currentUser)
router.get('/users/:id', authenticateToken, UserController.getUserById)
router.put('/users/:id', authenticateToken, uploads.single('avatar'), UserController.updateUser)

// Роуты постов
router.post('/posts', authenticateToken, PostController.createPost)
router.get('/posts', authenticateToken, PostController.getAllPosts)
router.get('/posts/:id', authenticateToken, PostController.getPostsById)
router.delete('/posts/:id', authenticateToken, PostController.deletePost)

// Роуты комментариев
router.post('/comments', authenticateToken, CommentController.createComment)
router.delete('/comments/:id', authenticateToken, CommentController.deleteComment)

// Роуты лайков
router.post('/likes', authenticateToken, LikeController.likePost)
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost)

// Роуты подписок
router.post('/follows', authenticateToken, FollowController.followUser)
router.delete('/unfollows', authenticateToken, FollowController.unfollowUser)

module.exports = router