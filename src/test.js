const {
    closePosition,
    openPosition,
    getPosition,
    modifyStoploss,
  } = require("./request");

async function test (){
    const get = await getPosition(199062851)
    console.log(get.data);
}

test()