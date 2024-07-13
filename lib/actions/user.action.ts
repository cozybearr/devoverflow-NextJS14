'use server'

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import Question from '@/database/question.model'
import { revalidatePath } from 'next/cache'
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from './shared.types'

export async function getUserById(params: any) {
  try {
    connectToDatabase()
    const { userId } = params
    const user = await User.findOne({ userId })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    connectToDatabase()
    const newUser = await User.create(params)
    return newUser
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase()

    const { clerkId, updateData, path } = params

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    })

    revalidatePath(path)
    return updatedUser
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase()

    const { clerkId } = params

    const deletedUser = await User.findOneAndDelete({ clerkId })

    if (!deletedUser) {
      throw new Error('User not found')
    }

    // deleted all things related to user

    // const userQuestionIds = await Question.find({
    //   author: deletedUser._id,
    // }).distinct("_id")

    await Question.deleteMany({ author: deletedUser._id })

    return deletedUser
  } catch (err) {
    console.log(err)
    throw err
  }
}
