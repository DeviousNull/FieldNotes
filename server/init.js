if (Categories.find({ 'category_name': 'Uncategorized' }).count() === 0) {
    Categories.insert({
        'category_name': 'Uncategorized',
        'parentID': undefined,
        'isSystemCategory': true,
    });
}
