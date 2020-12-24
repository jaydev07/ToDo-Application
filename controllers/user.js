const signup = async (req,res) => {
    const {name , email ,password } = req.body;
  
    const newUser = new User({
      name,
      email,
      password,
      items:[]
    });
  
    try{
      await newUser.save();
    }catch(err){
      console.log(err);
      return res.render('error',{error:"Please signup again."});
    }
    const user = newUser.toObject({getters:true});
  
    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
  
      item1.userId = user.id;
      await item1.save({session:sess});
  
      item2.userId = user.id;
      await item2.save({session:sess});
  
      newUser.items.push(item1);
      newUser.items.push(item2);
      await newUser.save({session:sess}); 
  
      sess.commitTransaction();
    }catch(err){
      console.log(err);
      res.render('error',{error:'Please try again.'});
    }
    
    res.redirect('/'+ user.id);
  }

  exports.signup = signup;