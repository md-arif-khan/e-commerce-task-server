const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000

// middlewarer
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jq2it7m.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
    const productsCollection=client.db('eCommerceTask').collection('products')
    const orderCollection=client.db('eCommerceTask').collection('orders')
    // products api
    app.get('/allProducts',async(req,res)=>{
        const query={}
        const cursor=productsCollection.find(query)
        const service=await cursor.toArray()
        res.send(service)
    })
    app.get('/product/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const product=await productsCollection.findOne(query)
        res.send(product)
    })

    // orders api
    app.get('/orders',async(req,res)=>{
        let query={};
        if(req.query.email){
            query={
                email:req.query.email
            }
        }
        const cursor=orderCollection.find(query)
        const orders=await cursor.toArray()
        res.send(orders)
    })
    app.post('/orders',async(req,res)=>{
        const order=req.body;
        const result=await orderCollection.insertOne(order)
        res.send(result)
    })
    app.delete('/orders/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await orderCollection.deleteOne(query)
        res.send(result)
    })
    app.get('/orderList',async(req,res)=>{
        const query={}
        const cursor=await orderCollection.find(query).toArray()
        res.send(cursor)
    })

   }
   finally{

   }
}
run().catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send('genius car server is running')
})
app.listen(port,()=>{
    console.log(` server running ${port}`)
})