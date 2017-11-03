var mongoose = require('mongoose');

var behaviorSchema = mongoose.Schema({
    userId: String,
    type: String,
    dateTime: String,
    data: String
});
var Behavior = mongoose.model('Behavior', behaviorSchema);
module.exports = Behavior;
//
// module.exports = {
//     addLog: function(userId, type, dateTime, data) {
//         let newBehavior = new Behavior();
//         newBehavior.userId = userId;
//         newBehavior.type = type;
//         newBehavior.dateTime = dateTime;
//         newBehavior.data = data;
//
//         newBehavior.save(function(err) {
//             if (err)
//                 throw err;
//             return done(null, newUser);
//         });
//     },
// }
