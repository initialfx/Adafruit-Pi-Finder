const stream = require('stream');
const os = require('os');
const { Netmask } = require('netmask');

class Subnet extends stream.Readable {

  constructor() {
    super();
    this.queue = [];

    const interfaces = os.networkInterfaces();

    Object.keys(interfaces).forEach(key => {

      interfaces[key].filter(address => {
        return address.family === 'IPv4' && !address.internal;
      }).forEach(address => {
        const mask = new Netmask(address.address, address.netmask);
        this.queue.push(mask.toString());
      });

    });

  }

  _read() {

    if(this.queue.length === 0)
      return this.push(null);

    this.push(this.queue.shift());

  }

}

exports = module.exports = Subnet;
