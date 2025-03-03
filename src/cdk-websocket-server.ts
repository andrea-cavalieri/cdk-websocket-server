/* eslint-disable import/no-extraneous-dependencies */
import { App } from 'aws-cdk-lib';
import { DistributionStack, ECSStack, VpcStack } from './index';





const app = new App();

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const vpcStack = new VpcStack(app, 'VpcStack', {
  env: devEnv,
});

const ecsStack = new ECSStack(app, 'WebSocketEcsStack', {
  env: devEnv,
}, vpcStack.vpcResources.vpc);

new DistributionStack(app, 'DistributionStack', {
  env: devEnv,
}, {
  applicationLoadBalancer: ecsStack.ecsResources.applicationLoadBalancer

});


app.synth();
