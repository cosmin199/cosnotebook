import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("user already exists")
  }

  const user = await User.create({ name, email, password, pic })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("error occuredddd")
  }
})

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("invalid email or password")
  }
})

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.pic = req.body.pic || user.pic

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser._id,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error("user not found")
  }
})

export { authUser, registerUser, updateUserProfile }
