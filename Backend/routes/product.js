var mongoose = require('mongoose');
var router=require('express').Router();
var Product = mongoose.model('Product');

var ObjectId = mongoose.Types.ObjectId;


//Get all con solo el precio vigente
//No está funcionando
router.get('/', (req, res, next) => {
    Product.find({})
    .populate('subcategory')
    .then(product => {
        if(!product) {return res.sendStatus(401);}
        return res.json(product)
    })
    .catch(next);
})

//Get one
router.get('/:id', (req, res, next) => {
    Product.findById(req.params.id).populate('subcategory')
    .then(product => {
        if(!product){
            res.send("Not found");
        }
        else{
            res.json(product);
        }
    });   
});

//Create
router.post('/new', (req, res, err) => {
    let name = req.body.name;
    let description = req.body.description;
    let subcategory = req.body.subcategory;
    let price = req.body.price;
    let provider = req.body.provider;

    var product = new Product({
        name: name,
        description: description,
        subcategory: subcategory, 
        provider: provider
    });

    product.save(function(err, doc){
        if(err){
           res.send('Error al intentar guardar el producto.');
        }
        else{
            res.json({ message: 'Producto agregado', data: doc });
        }
     });
    
});


router.delete('/delete/:id', (req, res, next) =>{
    let id = req.params.id;

    Product.findByIdAndRemove(id, (err, product)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            let response = {
                message: "Producto eliminado correctamente",
                id: product._id
            };
            res.status(200).send(response);
        }
    });
});

router.put('/update/:id', (req, res, next) =>{
    let query = {"_id": req.params.id};
    Product.findOneAndUpdate(query, {$set: req.body},{new: true},function(err, product){
        if(err){
            res.send("got an error");
        }
        else{
            res.send(product);                
        }
    });
})


module.exports=router;