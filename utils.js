module.exports = {
    listRemove: function (items) {
        let arrayFiltered = []
        items.filter(function(item) {
            if (item != "") {
                arrayFiltered.push(item)
            }
        })

        return arrayFiltered
    }
}