module.exports = {
  servers: {
    one: {
      host: '203.67.248.85',
      // host: '140.138.155.129',
      username: 'root',
      // pem: './path/to/pem'
      password: 's123'
      // or neither for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'ETHNotification5252',
    path: '.',
    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      PORT:5252,
      ROOT_URL: 'http://203.67.248.85:5252/',
      // ROOT_URL: 'http://140.138.155.129:2121/',
      MONGO_URL: 'mongodb://203.67.248.84:8888/ETHDB',
    },

    docker: {
      image: 'abernix/meteord:node-8.4.0-base',
    },
    
    deployCheckWaitTime: 60,

    enableUploadProgressBar: true
  }
};
