/**
 * Created by wilso_000 on 12/10/2014.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var contactSchema = Schema ({
    contactName		:	String,
    contactEmail	:	String,
    contactPhone	:	String
});

mongoose.model('contacts', contactSchema);