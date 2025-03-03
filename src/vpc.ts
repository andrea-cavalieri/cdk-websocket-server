import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';


export class VpcStack extends Stack {
  public vpcResources: VPCResources;
  constructor(scope: Construct, id: string, _props: StackProps) {
    super(scope, id);
    this.vpcResources = new VPCResources(this, 'VPCResources');

    // Export the VPC ID
    new CfnOutput(this, 'VpcIdOutput', {
      value: this.vpcResources.vpc.vpcId,
      exportName: 'VpcId',
    });

  }
}

export class VPCResources extends Construct {
  public vpc: Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new Vpc(this, 'VPC', {
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ServerPrivate',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'ServerPublic',
          subnetType: SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
      ],
      maxAzs: 2,
    });
  }
}
