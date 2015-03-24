/**
 * Created by wilso_000 on 12/10/2014.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var jobHuntSchema = Schema ({
    dateApplied	:	String,
    company		:	{type: Schema.Types.ObjectId, ref: 'references'},
    position	:	{type: Schema.Types.ObjectId, ref: 'references'},
    source      :	{type: Schema.Types.ObjectId, ref: 'references'},
    contactname :	{type: Schema.Types.ObjectId, ref: 'references'},
    status      :	{type: Schema.Types.ObjectId, ref: 'references'}
});

mongoose.model('jobhunts', jobHuntSchema);