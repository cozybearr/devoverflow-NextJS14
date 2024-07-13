import mongoose from 'mongoose'

let isConnected = false

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true)
  if (!process.env.MONGODB_URL) {
    return console.log('MONGODB_URL not found')
  }
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'dev-overflow',
    })
    isConnected = true
    console.log('Connected to database')
  } catch (err) {
    console.log('Error connecting to database', err)
  }
}
