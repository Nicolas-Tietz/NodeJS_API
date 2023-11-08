function notFound(req,res){
    return res.status(404).send('404 Route not found')
}


module.exports = notFound;