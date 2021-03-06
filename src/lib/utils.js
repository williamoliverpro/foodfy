module.exports = {
    listRemove(items) {
        let arrayFiltered = []
        items.filter(function(item) {
            if (item != "") {
                arrayFiltered.push(item)
            }
        })

        return arrayFiltered
    },
    date(timestamp) {
        const date = new Date(timestamp)
        let year = date.getUTCFullYear()
        let month = `0${date.getUTCMonth() + 1}`.slice(-2)
        let day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    }
}