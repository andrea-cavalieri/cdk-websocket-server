import { Stack, StackProps } from 'aws-cdk-lib';
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { VpcOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface DistributionResourcesProps {
  applicationLoadBalancer: ApplicationLoadBalancer;
}


export class DistributionStack extends Stack {
  constructor(scope: Construct, id: string, _props: StackProps, props: DistributionResourcesProps) { 
    super(scope, id);
    new DistributionResources(
      this,
      'DistributionResources',
      props,
    );
  }
}



export class DistributionResources extends Construct {
  public distribution: Distribution;

  constructor(scope: Construct, id: string, props: DistributionResourcesProps) {
    super(scope, id);

    // const distributionLoggingBucket = new Bucket(
    //   this,
    //   'DistributionLoggingBucket',
    //   {
    //     publicReadAccess: false,
    //     removalPolicy: RemovalPolicy.DESTROY,
    //     autoDeleteObjects: true,
    //     encryption: BucketEncryption.S3_MANAGED,
    //     objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
    //   },
    // );


    this.distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: VpcOrigin.withApplicationLoadBalancer(props.applicationLoadBalancer),
        viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
      },
      defaultRootObject: 'index.html',
      priceClass: PriceClass.PRICE_CLASS_100,
      //logBucket: distributionLoggingBucket,
      enableLogging: false,
    });

    // const customHeaderLambdaRole = new Role(this, 'customHeaderLambdaRole', {
    //   assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    //   inlinePolicies: {
    //     ['cloudFrontPolicy']: new PolicyDocument({
    //       statements: [
    //         new PolicyStatement({
    //           resources: [
    //             `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${
    //               this.distribution.distributionId
    //             }`,
    //           ],
    //           actions: [
    //             'cloudfront:GetDistribution',
    //             'cloudfront:UpdateDistribution',
    //           ],
    //         }),
    //       ],
    //     }),
    //   },
    //   managedPolicies: [
    //     ManagedPolicy.fromAwsManagedPolicyName(
    //       'service-role/AWSLambdaBasicExecutionRole',
    //     ),
    //   ],
    // });

    // const customHeaderCustomResourceLambda = new NodejsFunction(
    //   this,
    //   'customHeaderCustomResourceLambda',
    //   {
    //     handler: 'index.handler',
    //     entry: 'src/resources/customHeader/index.ts',
    //     architecture: Architecture.ARM_64,
    //     timeout: Duration.minutes(1),
    //     runtime: Runtime.NODEJS_18_X,
    //     role: customHeaderLambdaRole,
    //   },
    // );

    //   const customHeaderCustomResourceProvider = new Provider(
    //     this,
    //     'customHeaderCustomResourceProvider',
    //     {
    //       onEventHandler: customHeaderCustomResourceLambda,
    //       logRetention: RetentionDays.ONE_WEEK,
    //     },
    //   );

    //   new CustomResource(this, 'customHeaderCustomResource', {
    //     serviceToken: customHeaderCustomResourceProvider.serviceToken,
    //     properties: {
    //       DistributionId: this.distribution.distributionId,
    //       Origins: [
    //         {
    //           OriginId: 'defaultOrigin',
    //           CustomHeaders: [
    //             {
    //               HeaderName: props.customHeader,
    //               HeaderValue: props.randomString,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   });
  }
}
