require('source-map-support').install()

function sayHello (name) {
  throw new Error('error!!!')
  console.log(`Hello, ${name}`)
}

sayHello('World')