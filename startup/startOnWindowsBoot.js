var startOnBoot = require('./startOnBoot');

startOnBoot.enableAutoStart('SccdMobileServer', 'D:\\New\\nodejs\\APPS\\sccdAPP\\start.bat',((ret)=>{
    console.log(ret)
}));
