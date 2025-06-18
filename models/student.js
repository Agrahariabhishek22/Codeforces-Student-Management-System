const mongoose=require('mongoose');


const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    cfHandle:{
        type:String,
        required:true
    },
    currentRating:{
        type:String,
        // required:true
    },
    maxRating:{
        type:String,
        // required:true
    },
    lastSynced: {
    type: Date,
    default: null
  },
  isAutoMailEnabled: {
    type: Boolean,
    default: true
  },
  inactiveReminderCount: {
    type: Number,
    default: 0
  }
},
 {
  timestamps: true // adds createdAt and updatedAt
}
);

module.exports=mongoose.model('Student',studentSchema);

