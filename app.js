var express = require('express');
var app = express();
var userSchema = require('./user');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

//链接本地数据库
var DB_URL = 'mongodb://localhost:27017/mongoose'
mongoose.connect(DB_URL);

app.use(express.static('public'));
//解析表单数据
app.use(bodyParser.urlencoded({extended:true}))
//显示静态页面
app.get('/',function(req,res){
    res.render('index',__dirname+"public/index.html")
})
/*插入数据库函数*/
function insert(name,psw){
    var user=new userSchema({
        username : name,
        userpsw : psw,
        logindate : new Date()
    });

    user.save(function(err,res){
        if(err){
            console.log(err)
        }
        else{
            console.log(res);
        }
    })
}

/*注册页面数据接收*/
app.post('/register', function (req, res) {
  //先查询有没有这个user
  console.log("req.body"+req.body);
  var UserName = req.body.username;
  var UserPsw = req.body.password;
  //通过账号验证
  var updatestr = {username: UserName};
   res.setHeader('Content-type','application/json;charset=utf-8')
    console.log(updatestr);
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 0){
                //如果查出无数据,就将账户密码插入数据库
                insert(UserName,UserPsw); 
                //返回数据到前端
                res.send({status:'success',message:'true'}) 
            }else{
                res.send({status:'success',message:'false'}) 
            }
        }
    })  
});

/*登录处理*/
app.post('/login', function (req, res, next) {
  //先查询有没有这个user
  console.log("req.body"+req.body);
  var UserName = req.body.username;
  var UserPsw = req.body.password;
  //通过账号密码搜索验证
  var updatestr = {username: UserName,userpsw:UserPsw};
    res.setHeader('Content-type','application/json;charset=utf-8')
    console.log(updatestr);
    userSchema.find(updatestr, function(err, obj){
        console.log(obj);
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 1){
                console.log('登录成功')
                res.send({status:'success',message:'true'}) 
            }else{
                console.log('请注册账号'); 
                res.send({status:'success',message:'false'}) 
            }
        }
    })
});

var server = app.listen(1993,function(){
    console.log('server connect');
})