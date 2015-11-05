Template.cateTemplate.events({

    'click .deleteCateButton': function(e){
        if(confirm("Are you sure you want to delete this term?")){
            //Remove the cates collection
            Cates.remove(this._id);
        }
    },
});

Template.cateTemplate.helpers({
    'markdownedText': function() {
        var converter = new Showdown.converter();
        return converter.makeHtml(this.text);
    }
});
