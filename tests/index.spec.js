const request = require('supertest');
const axios= require('axios')
const { app } = require('../app2');

const Product = require("../models/Products");
const Quoter = require('../models/quoters');

const quoterCorrect2= {
    title: 'AMIGAAAA',
    description: 'AMIGAAAA',
    image:'',
    products:[
        {
            "sku":"0146",
            "quantity":8,
        }
    ]
}

const quoterCorrect= {
    title: 'Amigaaaaa2',
    description: 'Amigaaaaa2',
    image:'',
    products:[
        {
            "sku":"0789",
            "quantity":8,
        },
        {
            "sku":"6585",
            "quantity":3
        }
    ]
}

const quoterCorrect3= {
    title: 'quoterCorrect3',
    description: 'quoterCorrect3',
    image:'',
    products:[
        {
            "sku":"0146",
            "quantity":8,
        },
        {
            "sku":"0290",
            "quantity":3
        }
    ]
}

const quoterCorrect4= {
    title: 'quoterCorrect4',
    description: 'quoterCorrect3',
    image:'',
    products:[
        {
            "sku":"0146",
            "quantity":8,
        },
        {
            "sku":"0290",
            "quantity":3
        }
    ]
}

const quoterBadWithoutTitle= {
    //title: 'pruebaBad',
    image:'',
    products:[
        {
            "sku":"0146",
            "quantity":8
        }
    ]
}

const quoterBadWithoutImage= {
    title: 'pruebaBad',
    //image:'',
    products:[
        {
            "sku":"0146",
            "quantity":8
        }
    ]
}

const quoterWithProductArrayBad={
    title: 'pruebaBad',
    image: '',
    products:[
        {
            "skupd":"0146",
            "quantity":8
        }
    ]
}



const signinTest= async () =>{

    // The user admin must exist and be active in the DB Nest

    const {data}= await axios.post(
        'http://localhost:3005/api/auth/login',
        {
            "email": process.env.ADMIN_NEST_EMAIL,
            "password": process.env.ADMIN_NEST_PASSWORD,
        }
    );
    return data
}

const signinTestUser= async () =>{

    // The user admin must exist and be active in the DB Nest

    const {data}= await axios.post(
        'http://localhost:3005/api/auth/login',
        {
            "email": process.env.USER_NEST_EMAIL,
            "password": process.env.USER_NEST_PASSWORD,
        }
    );
    return data

}

const signinTestSuperAdmin= async () =>{

    // The user admin must exist and be active in the DB Nest

    const {data}= await axios.post(
        'http://localhost:3005/api/auth/login',
        {
            "email": process.env.SUPER_NEST_EMAIL,
            "password": process.env.SUPER_NEST_PASSWORD,
        }
    );
    return data
}


const globalCreateQuoter = async (quot) => {
    const quoter= await request(app)
        .post('/api/quoters/create')
        .send(quot)
        .set('Authorization', `Bearer ${token}`);
        expect(quoter.statusCode).toBe(201);
    return quoter.body[0]
};

const globalDeleteQuoter = async (idToDelete) => {
    await request(app)
         .delete('/api/quoters/delete/'+idToDelete)
         .set('Authorization', `Bearer ${token}`);
        //expect(response.statusCode).toBe(200);
};

const randomUUID='c16ca228-cef4-453d-b007-7e2383eb894f';

let user={};
let admin={};
let super_admin={};

let token='';
let tokenUser='';
let tokenSuperAdmin='';


let idQuoterAdmin=''
let idQuoterUser=''

beforeAll(async () => {
    const infoAdmin= await signinTest();
    token= infoAdmin.token;
    admin= infoAdmin.user;

    const infoUser= await signinTestUser();
    tokenUser=infoUser.token;
    user= infoUser.user;

    const infoSuper= await signinTestSuperAdmin();
    tokenSuperAdmin=infoUser.token;
    super_admin=infoSuper.user;

    
  });


beforeEach(async() => {
    const quoterAdmin= await globalCreateQuoter(quoterCorrect2)
    idQuoterAdmin=quoterAdmin.id
});

afterEach(async() => {
    await globalDeleteQuoter(idQuoterAdmin)
});



  
afterAll(() => {
    //return clearCityDatabase();
});

  
/********************* GET ALL QUOTER ***************************** */
describe('GET /api/quoters', () =>{
    test('should respond with a 200 status code', async()=>{
       const response= await request(app).get('/api/quoters').send();
       expect(response.statusCode).toBe(200);
    });

    test('should respond 200 - array', async()=>{
        const response= await request(app).get('/api/quoters').send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array)
     });
});


/********************* GET QUOTER BY USER ************************* */
describe('GET /api/quoters/idQuoter', () =>{

    test('should respond array 200', async()=>{
        const response= await request(app).get('/api/quoters/iduser/'+admin.id).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0].id).toBeDefined();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        expect(response.body[0].image).toBeDefined();
        expect(response.body[0].products).toBeDefined();
        expect(response.body[0].products).toBeInstanceOf(Array);
        //expect(response.body[0].products[0].idProduct).toBeDefined();
        expect(response.body[0].products[0].sku).toBeDefined();
        expect(response.body[0].products[0].quantity).toBeDefined();

     });

     test('bad UUID should respond array (empty) 200', async()=>{
        const response= await request(app).get('/api/quoters/iduser/'+randomUUID).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(!response.body[0]).toEqual(true);
     });

     test('bad ID should respond 400', async()=>{
        const response= await request(app).get('/api/quoters/iduser/'+'dfsdf5545').send();
        expect(response.statusCode).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
       expect(response.body.errors).toBeDefined();
       expect(response.body.errors[0].message && response.body.errors[0].field).toBeDefined();
     });

});


/********************* GET QUOTER BY ID ***************************** */
describe('GET /api/quoters/idQuoter', () =>{

    test('should respond array', async()=>{
        const response= await request(app).get('/api/quoters/'+idQuoterAdmin).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);

        expect(response.body[0].id).toBeDefined();
        expect(response.body[0].id).toEqual(idQuoterAdmin);

        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        expect(response.body[0].image).toBeDefined();
        expect(response.body[0].products).toBeDefined();
        expect(response.body[0].products).toBeInstanceOf(Array);

        //expect(response.body[0].products[0].idProduct).toBeDefined();
        expect(response.body[0].products[0].sku).toBeDefined();
        expect(response.body[0].products[0].quantity).toBeDefined();

     });
});


/********************* PUT QUOTER  ***************************** */
describe('PUT /api/quoters/edit',  () =>{
    

    test('Update fullness (200)', async()=>{

        const dataToUpdate={
            title: 'testing',
            description: '',
            image:'',
            products:[
                {
                    "sku":"146",
                    "quantity":88
                }
            ]
        }
        const quoter = await globalCreateQuoter(quoterCorrect3);
       
        const response= await request(app)
            .put('/api/quoters/edit/'+quoter.id)
            .send(dataToUpdate)
            .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200)
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0].id).toBeDefined();
            expect(response.body[0].title).toBeDefined();
            expect(response.body[0].description).toBeDefined();
            expect(response.body[0].image).toBeDefined();
            expect(response.body[0].products).toBeDefined();
            expect(response.body[0].products).toBeInstanceOf(Array);
            //expect(response.body[0].products[0].idProduct).toBeDefined();
            expect(response.body[0].products[0].sku).toBeDefined();
            expect(response.body[0].products[0].quantity).toBeDefined();


            const quoterDB= await Quoter.findAll({
                where: {'$id$': quoter.id},
                include:[{model: Product,as: 'products',}]
            });


            expect(quoterDB).toBeInstanceOf(Array);
            expect(quoterDB[0].title).toEqual(dataToUpdate.title);
            expect(quoterDB[0].description).toEqual(dataToUpdate.description);
            expect(quoterDB[0].image).toEqual(dataToUpdate.image);
            expect(quoterDB[0].products).toBeDefined();
            expect(quoterDB[0].products).toBeInstanceOf(Array);
            expect(quoterDB[0].products[0].sku).toEqual(dataToUpdate.products[0].sku);
            expect(quoterDB[0].products[0].quantity).toEqual(dataToUpdate.products[0].quantity);



        await globalDeleteQuoter(quoter.id);
    }); 


  


    test('We can not update a repetitive title (400)', async()=>{

        const quoter = await globalCreateQuoter(quoterCorrect3);
       
        const response= await request(app)
         .put('/api/quoters/edit/'+idQuoterAdmin)
         .send({
            title: quoter.title,
            description: '',
            image:'',
            products:[
                {
                    "sku":"0146",
                    "quantity":8,
                },
            ]
         })
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();

        await globalDeleteQuoter(quoter.id);
    });  


    test('Bad data(Product Array) should respond with a 400 status code', async()=>{
        const response= await request(app)
         .put('/api/quoters/edit/'+idQuoterAdmin)
         .send(quoterWithProductArrayBad)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    });  

    test('Bad Data (Empty Athorization) should respond with a 401 status code', async()=>{
        const response= await request(app)
         .put('/api/quoters/edit/'+idQuoterAdmin)
         .send(quoterCorrect)
         //.set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    });   

    test('Bad Data (bad JWT) should respond with a 401 status code', async()=>{
        const response= await request(app)
         .put('/api/quoters/edit/'+idQuoterAdmin)
         .send(quoterCorrect)
         .set('Authorization', `Bearer fgdfgdfghdfgdfghdfgf`);
        expect(response.statusCode).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    }); 

    test('Bad Data (ID quoter no UUIID) should respond with a 400 status code', async()=>{
        const response= await request(app)
         .put('/api/quoters/edit/'+'nc45zxc')
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message && response.body.errors[0].message).toBeDefined();
     }); 

     test('Bad Data (ID quoter  UUIID dont exist) should respond with a 400 status code', async()=>{
        const response= await request(app)
         .put('/api/quoters/edit/'+randomUUID)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     }); 

     test('Bad Data (Token User try delete other quoter different his) should respond with a 403 status code', async()=>{
        const response= await request(app)
         .put('/api/quoters/edit/'+idQuoterAdmin)
         .send(quoterCorrect)
         .set('Authorization', `Bearer ${tokenUser}`)
        expect(response.statusCode).toBe(403);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     });

});

/********************* CREATE QUOTER ***************************** */
describe('POST /api/quoters/create - Error when send bad data', () =>{ 


    let idNewQuoter=''
    test('should respond with a 200 status code', async()=>{
        const quoter= await request(app)
        .post('/api/quoters/create')
        .send(quoterCorrect)
        .set('Authorization', `Bearer ${token}`);
        expect(quoter.statusCode).toBe(201);
        expect(quoter.body).toBeInstanceOf(Array);
        expect(quoter.body[0].id).toBeDefined();
        expect(quoter.body[0].title).toBeDefined();
        expect(quoter.body[0].description).toBeDefined();
        expect(quoter.body[0].image).toBeDefined();
        expect(quoter.body[0].products).toBeDefined();
        expect(quoter.body[0].products).toBeInstanceOf(Array);
        //expect(quoter.body[0].products[0].idProduct).toBeDefined();
        expect(quoter.body[0].products[0].sku).toBeDefined();
        expect(quoter.body[0].products[0].quantity).toBeDefined();
        idNewQuoter=quoter.body[0].id;
    });

    test('data correctly saved in DB', async()=>{
        
        const quoterDB= await Quoter.findAll({
            where: {'$id$': idNewQuoter},
            include:[{model: Product,as: 'products',}]
        });
        expect(quoterDB).toBeInstanceOf(Array);
        expect(quoterDB[0].title).toEqual(quoterCorrect.title);
        expect(quoterDB[0].description).toEqual(quoterCorrect.description);
        expect(quoterDB[0].image).toEqual(quoterCorrect.image);
        expect(quoterDB[0].products).toBeDefined();
        expect(quoterDB[0].products).toBeInstanceOf(Array);
        expect(quoterDB[0].products[0].sku).toEqual(quoterCorrect.products[0].sku);
        expect(quoterDB[0].products[0].quantity).toEqual(quoterCorrect.products[0].quantity);
    })




    test('bada data (title already exist) should respond with a 400 status code', async()=>{
        const response= await request(app)
        .post('/api/quoters/create')
        .send(quoterCorrect)
        .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    });

    test('Bad data(Title) should respond with a 400 status code', async()=>{
       const response= await request(app)
        .post('/api/quoters/create')
        .send(quoterBadWithoutTitle)
        .set('Authorization', `Bearer ${token}`);
       expect(response.statusCode).toBe(400);
       expect(response.body).toBeInstanceOf(Object);
       expect(response.body.errors).toBeDefined();
       expect(response.body.errors[0].message && response.body.errors[0].field).toBeDefined();
    });     

    test('Bad data(Image) should respond with a 400 status code', async()=>{
        const response= await request(app)
         .post('/api/quoters/create')
         .send(quoterBadWithoutImage)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message && response.body.errors[0].field).toBeDefined();
     });   
     
     test('Bad data(Product Array) should respond with a 400 status code', async()=>{
        const response= await request(app)
         .post('/api/quoters/create')
         .send(quoterWithProductArrayBad)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     
     });     

     test('Bad Data (Empty Athorization) should respond with a 401 status code', async()=>{
        const response= await request(app)
         .post('/api/quoters/create')
         .send(quoterCorrect)
         //.set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     });   

     test('Bad Data (bad JWT) should respond with a 401 status code', async()=>{
        const response= await request(app)
         .post('/api/quoters/create')
         .send(quoterCorrect)
         .set('Authorization', `Bearer fgdfgdfghdfgdfghdfgf`);
        expect(response.statusCode).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     }); 


     

     test('Good deleted, should respond with a 200 status code', async()=>{
        const response= await request(app)
         .delete('/api/quoters/delete/'+idNewQuoter)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });
});

const badIDQuoter='85';
/********************* DELETE QUOTER ***************************** */
describe('DELETE /api/quoters',  () =>{ 
    
    test('Bad Data (Empty Athorization) should respond with a 401 status code', async()=>{
        const response= await request(app)
         .delete('/api/quoters/delete/'+badIDQuoter)
        // .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     }); 

     test('Bad Data (ID quoter no UUIID) should respond with a 401 status code', async()=>{
        const response= await request(app)
         .delete('/api/quoters/delete/'+badIDQuoter)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message && response.body.errors[0].message).toBeDefined();
     }); 

     test('Bad Data (ID quoter  UUIID dont exist) should respond with a 400 status code', async()=>{
        const response= await request(app)
         .delete('/api/quoters/delete/'+randomUUID)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     }); 

     test('Bad Data (Token User try delete other quoter different his) should respond with a 403 status code', async()=>{
        const response= await request(app)
         .delete('/api/quoters/delete/'+idQuoterAdmin)
         .set('Authorization', `Bearer ${tokenUser}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
     });

     test('Good deleted, should respond with a 200 status code', async()=>{
        const response= await request(app)
         .delete('/api/quoters/delete/'+idQuoterAdmin)
         .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });
});


/********************* BAD request uRL ***************************** */
describe('All bad request /apppi',  () =>{
    test('GET should respond with a 404 status code', async()=>{
        const response= await request(app)
         .get('/apppi')
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    }); 

    test('POST should respond with a 404 status code', async()=>{
        const response= await request(app)
         .post('/apppi')
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    }); 

    test('DELETE should respond with a 404 status code', async()=>{
        const response= await request(app)
         .delete('/apppi')
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    }); 

    test('UPDATE should respond with a 404 status code', async()=>{
        const response= await request(app)
         .put('/apppi')
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toBeDefined();
    }); 
})


//todo  *************** Upload image ********************************