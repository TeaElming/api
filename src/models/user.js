/* eslint-disable jsdoc/check-indentation */
/* eslint-disable jsdoc/check-tag-names */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const { isEmail } = validator

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Invalid email address']
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  joined: {
    type: Date,
    default: Date.now
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    /**
     * Remove the _id and __v fields from the JSON output and transform the _id field to id.
     *
     * @param {Document} doc - The mongoose document which is being converted
     * @param {Document} ret - The plain object representation which has been converted
     */
    transform: function (doc, ret) {
      delete ret._id // Remove '_id' field from the JSON output
      delete ret.__v // Remove '__v' field (version key) from the JSON output
    }
  }
})

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Salts and hashes password before save.
userSchema.pre('save', async function () {
  // Only hash if the pword has been modified or is new
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

/**
 * Authenticate a user.
 *
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<Document>} The authenticated user.
 */
userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user) {
    console.log('User not found')
    return false
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    console.log('Username and Password do not match')
    return false
  }
  console.log('User authenticated')
  return user
}

// Create the User model
export const User = mongoose.model('User', userSchema)
