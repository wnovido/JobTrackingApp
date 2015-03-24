/**
 * Created by wilso_000 on 12/17/2014.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var referenceSchema = new Schema ({
    Group: {
        type: String,
        default: '',
        required: 'Please fill empty field',
        trim: true
    },
    Name: {
        type        :   String,
        default     :   '',
        required    :   'Please fill empty field',
        trim        :   true,
        index       :   {unique :   true}
    }
});

mongoose.model('references', referenceSchema);

