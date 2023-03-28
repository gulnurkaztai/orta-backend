const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },

    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    avatarPic: {
        type :String 
    },
    bio: {
        type: String,
        default: ""
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
},
{
    timestamps: true
}, 
{ typeKey: '$type' }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  });

module.exports = mongoose.model('User', userSchema)