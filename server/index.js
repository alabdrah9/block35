
{
    client,
    createTables,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    createFavorites,
    fetchFavorite,
    deleteFavorite
  }  require('./db');
  const express = require('express');
const { createUser, fetchUsers } = require('./db');
  const app = express();
  app.use(express.json());
  
  app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/products', async(req, res, next)=> {
    try {
      res.send(await fetchProducts());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/users/:id/favorites ', async(req, res, next)=> {
    try {
      res.send(await fetchFavorites(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.delete('//users/:userId/favorites/:id - ', async(req, res, next)=> {
    try {
      await deleteFavorite({ user_id: req.params.userId, id: req.params.id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.status(201).send(await createFavorites({user_id: req.params.id, skill_id: req.body.skill_id}));
    }
    catch(ex){
      next(ex);
    }
  });
  
  const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, larry, ethyl, dancing, singing, plateSpinning, juggling] = await Promise.all([
      createUser({ username: 'moe', password: 'moe_pw'}),
      createUser({ username: 'lucy', password: 'lucy_pw'}),
      createUser({ username: 'larry', password: 'larry_pw'}),
      createUser({ username: 'ethyl', password: 'ethyl_pw'}),
      createSkill({ name: 'dancing'}),
      createSkill({ name: 'singing'}),
      createSkill({ name: 'plate spinning'}),
      createSkill({ name: 'juggling'})
    ]);
  
    console.log(await fetchUsers());
    console.log(await fetchProducts());
  
    const userSkills = await Promise.all([
      createProduct({ user_id: moe.id, skill_id: plateSpinning.id}),
      createProduct({ user_id: moe.id, skill_id: dancing.id}),
      createProduct({ user_id: ethyl.id, skill_id: singing.id}),
      createProduct({ user_id: ethyl.id, skill_id: juggling.id})
    ]);
    console.log(await fetchFavorites(moe.id));
    await deleteFavorite({ user_id: moe.id, id: userSkills[0].id});
    console.log(await fetchFavorite(moe.id));
  
    console.log(`curl localhost:3000/api/users/${ethyl.id}/favorites`);
  
    console.log(`curl -X POST localhost:3000/api/favorites/${ethyl.id}/favorites -d '{"favorite_id": "${dancing.id}"}' -H 'Content-Type:application/json'`);
    console.log(`curl -X DELETE localhost:3000/api/favorites/${ethyl.id}/userFavorites/${userFavorites[3].id}`);
    
    console.log('data seeded');
  
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  
  }
  init();
  