import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {type: String, default: null},
    last_name: {type: String, default: null},
    email: {type: String, validate: {
        validator: function(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Not a valid email address'
    }},
    phoneNumber: {type: String, trim: true, unique: true, validate: {
        validator: function(v) {
            return /^[0-9]{10}/.test(v);
      },
      message: '{VALUE} is not a valid 10 digit number!'
    }},
    password: {type: String, minlength: 7},
    confirmPassword: {type: String, minlength: 7},
    token: { type: String},
});

const User = mongoose.model('User', userSchema);
export { User };