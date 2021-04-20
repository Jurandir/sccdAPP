var startOnBoot = require('./startOnBoot');

startOnBoot.getAutoStartValue('SccdMobileServer',(ret)=>{
    console.log(ret)
});

