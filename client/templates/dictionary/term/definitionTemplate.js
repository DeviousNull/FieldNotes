Template.definitionTemplate.events({

    'click .deleteDefinitionButton': function(e){
        if(confirm("Are you sure you want to delete this term?")){
            //Remove the defintions collection
            Definitions.remove(this._id);
        }
    },
});

Template.definitionTemplate.helpers({
    'markdownedText': function() {
        var converter = new Showdown.converter();
        return converter.makeHtml(this.text);
    }
});
