var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');
const { strict } = require('assert');


//用于处理request中的查询字段
var serachProcess = function(target)
{
    target = target.slice(6,);
    console.log(target);
    var segment2 = target.indexOf('&')
    var name = target.substr(0, segment2-1);
    var message = target.substr(segment2+9,);
    message = "'"+message+"'";
    var res = "("+name +"," +message+");";
    return res;
} 



//main part
var core = http.createServer();
core.on('request',function (request, response) {
    //测试新的内容，返回网页
    var temp = url.parse(request.url);
    var pathname = temp.pathname;
    console.log(temp.query);
   
   // 输出请求的文件名
    console.log("Request for " + pathname + " received.");
    //console.log(request);

    if (pathname == '/')
    {                                                       //pathname.substr(1), 
        console.log("main page sent");
        fs.readFile('index.html', function (err, data)  
        {
            if (err) {
            console.log(err);
            response.writeHead(404, {'Content-Type': 'text/html'});
            }else{             
            response.writeHead(200, {'Content-Type': 'text/html'});    
            
            // 响应文件内容
            response.write(data.toString());    
            response.end();
            }
        });
    }
    else if(pathname == '/comment')
    {
        console.log("data page sent");

        var find2 = "SELECT * FROM ——————;"//放入你自己的数据库名

        var mysql_user = {
            host:'localhost',//主机地址（默认为：localhost）
            user:'______',//你的用户名
            password:'_______',//你的密码
            database:'_________'//你的数据库名
        };

        var connection = mysql.createConnection(mysql_user);//,{multipleStatements: true}
        connection.connect();
        console.log("connection activated");

        var requestRes = serachProcess(temp.search); //get the data from the request
        console.log(requestRes);
        var find3 = "Insert into ——————(id,text) values " + requestRes; //放入你自己的数据库名
        console.log(find3);


        connection.query(find3, function(err, result)
            {
                if (err) 
                {   //链接失败 直接return;
                console.log('[错误]' + err);
                return;
                };
                if(result.length) 
                {
                    console.log(result);
                }
            })
            var data2;
            fs.readFile('index.html', function (err, data)  
            {
                if (err) {
                console.log(err);
                response.writeHead(404, {'Content-Type': 'text/html'});
                }else{             
                response.writeHead(200, {'Content-Type': 'text/html'});    
                data2 = data.toString();
                
                }
            });
        // return all the result for showing

        connection.query(find2, function(err, result)
            {
                if (err) 
                {   //链接失败 直接return;
                console.log('[错误]' + err);
                return;
                };

                if (result.length) {   //如果查到了数据
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    var result2 = JSON.stringify(result)
                    result2 = "<div>" + result2 + "</div>"
                    response.write(data2 + result2)
                    response.end();
                    }
                else {
                    
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    var result2 = JSON.stringify(result)
                    //和网页一起发回，可以继续增加信息，这里可以优化
                    result2 = "<div>" + result2 + "</div>"
                    response.write(data2 + result2);
                    response.end();
                }
                
                
            }
        );

        connection.end();
    }
    
}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/');
