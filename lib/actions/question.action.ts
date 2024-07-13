'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'
import { CreateQuestionParams, GetQuestionsParams } from './shared.types'
import { revalidatePath } from 'next/cache'

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase()
    const { title, content, tags, author } = params
    console.log(author)
    const question = await Question.create({
      title,
      content,
      author,
    })
    // Find tag and push question_id into tag, or insert new tag with its question_id
    const tagDocuments = []
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(tag, 'i') },
        },
        {
          $setOnInsert: { name: tag },
          $push: {
            question: question._id,
          },
        },
        {
          upsert: true,
          new: true,
        }
      )
      // get the list of ids of updated tags
      tagDocuments.push(existingTag._id)
    }

    // update tags for question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    })
    revalidatePath('/')
  } catch (error) {
    console.log(error)
  }
}

export async function getQuestion(params: GetQuestionsParams) {
  try {
    connectToDatabase()
    const questions = await Question.find({})
      .populate({ path: 'tags' })
      .populate({ path: 'author' })
      .sort({ createdAt: -1 })
    return { questions }
  } catch (error) {
    console.log(error)
  }
}
