var startOnBoot = require('./startOnBoot');

startOnBoot.disableAutoStart('SccdMobileServer',((ret)=>{
    console.log(ret)
}));
