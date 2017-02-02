var aws = require('./shared');


function ELB(region) {
  if (!(this instanceof ELB)) {
    return new ELB(region);
  }

  this.awsApi = aws.api('ELB', {region}, {
    describeLoadBalancerAttributes: {property: 'LoadBalancerAttributes'},
    describeLoadBalancers: {property: 'LoadBalancerDescriptions'}
  });
}

ELB.prototype.describeLoadBalancer = function describeLoadBalancer(LoadBalancerName) {
  return this.describeLoadBalancers(LoadBalancerName)
    .then(elbs => elbs.shift());
};

ELB.prototype.describeLoadBalancerAttributes = function describeLoadBalancerAttributes(LoadBalancerName) {
  return this.awsApi
    .then(api => api.describeLoadBalancerAttributes({LoadBalancerName}));
};

ELB.prototype.describeLoadBalancers = function describeLoadBalancers(LoadBalancerNames) {
  if (!(LoadBalancerNames instanceof Array)) {
    LoadBalancerNames = [LoadBalancerNames];
  }

  return this.awsApi
    .then(api => api.describeLoadBalancers({LoadBalancerNames}));
};

ELB.prototype.status = function status(loadBalancer) {
  return this.describeLoadBalancerAttributes(loadBalancer.loadBalancerName)
    .then(attributes => ({
      accessLogs: attributes && attributes.AccessLog && attributes.AccessLog.Enabled,
      crossZone: attributes && attributes.CrossZoneLoadBalancing && attributes.CrossZoneLoadBalancing.Enabled,
      draining: attributes && attributes.ConnectionDraining && attributes.ConnectionDraining.Enabled && attributes.ConnectionDraining.Timeout === 30,
      ws: false
    }));
};


module.exports = aws.regionCache(ELB);
