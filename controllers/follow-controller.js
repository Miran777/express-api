const { prisma } = require("../prisma/prisma-client")

const FollowController = {
    followUser: async (req, res) => {
        const { followingId } = req.body
        const userId = req.user.userId

        if (followingId === userId) {
            return res.status(500).json({ error: "You can't follow yourself" })
        }

        try {
            const existingFollow = await prisma.follows.findFirst({
                where: {
                    AND: [
                        {followerId: userId},
                        {followingId: followingId},
                    ]
                }
            })

            if (existingFollow) {
                return res.status(400).json({ error: "Follow already exists" })
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId } }, 
                    following: { connect: { id: followingId } }
                }
            })

            res.json({ message: "Follow successfully created" })
        } catch (error) {
            console.error("Follow error", error)
            return res.status(500).json({ error: "Internal server error" })
        }
    },
    unfollowUser: async (req, res) => {
        const { folowingId } = req.body
        const userId = req.user.userId

        try {
            const follows = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId: folowingId }
                    ]
                }
            })

            if (!follows) {
                return res.status(404).json({ error: "Entry does not exist" })
            }

            await prisma.follows.delete({
                where: { id: follows.id }
            })

            res.json({ message: "Unfollow successfully created" })
        } catch (error) {
            console.error("Unfollows error", error)
            return res.status(500).json({ error: "Internal server error" })
        }
    },
}

module.exports = FollowController