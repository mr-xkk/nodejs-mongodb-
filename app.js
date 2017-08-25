var express = require('express');
var app = express();
var userSchema = require('./user');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
//加密模块
var crypto = require("crypto");

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
function insert(name,psw,nick){
      //数据格式
    var user =  new userSchema({
                username : name,
                userpsw : psw,
                nickname : nick,
                logindate : new Date()
            });
    user.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}

/*注册页面数据接收*/
app.post('/register', function (req, res) {
  //处理跨域的问题
  res.setHeader('Content-type','application/json;charset=utf-8')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
   //先查询有没有这个user
  var UserName = req.body.username;
  var UserPsw = req.body.password;
  var Nickname = req.body.nickname;
  //密码加密
  var md5 = crypto.createHash("md5");
  var newPas = md5.update(UserPsw).digest("hex");
  //通过账号验证
  var updatestr = {username: UserName};
    if(UserName == ''){
       res.send({status:'success',message:false}) ;
    }
    res.setHeader('Content-type','application/json;charset=utf-8')
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 0){
                //如果查出无数据,就将账户密码插入数据库
                insert(UserName,newPas,Nickname); 
                //返回数据到前端
                res.send({status:'success',message:true}) 
            }else if(obj.length !=0){
                res.send({status:'success',message:false}) 
            }else{
                res.send({status:'success',message:false}) 
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
  //密码加密  
  var md5 = crypto.createHash("md5");
  var newPas = md5.update(UserPsw).digest("hex");
  //通过账号密码搜索验证
  var updatestr = {username: UserName,userpsw:newPas};
  //处理跨域的问题
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 1){
                console.log('登录成功');
                res.send({status:'success',message:true,data:obj}); 
            }else{
                console.log('请注册账号'); 
                res.send({status:'success',message:false}); 
            }
        }
    })
});

//处理昵称和头像的上传
app.post('/uploadImg',function(req,res,next){
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    //id
    var getName = req.body.sendName;
    //昵称
    var myName = req.body.myName;

    var checkName = {username: getName};
    //修改默认的昵称
    userSchema.update(checkName,{nickname:myName},function(err, nick){
        console.log('我是昵称'+nick);
        res.send({status:'success',message:true,data:nick}); 
    })
})


var server = app.listen(1993,function(){
    console.log('server connect');
})