Template.summaryList.helpers({
    'Summaries': function(){
        return Summaries.find({}, { 'reactive': false });
    }
});
