import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';

import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStepFuntionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const startState = new stepfunctions.Pass(this, 'PassState', {
      result: stepfunctions.Result.fromObject({ Value: 'Pass' }),
      resultPath: '$.result',
    });

    // const waitState = new stepfunctions.Wait(this, 'WaitState', {
    //   time: stepfunctions.WaitTime.secondsPath('$.triggerTime'),
    // })
    
    const successState = new stepfunctions.Pass(this, 'SuccessState', {
      result: stepfunctions.Result.fromObject({ Value: 'SuccessState' }),
      resultPath: '$.result',
    });
    const failureState = new stepfunctions.Pass(this, 'FailureState', {
      result: stepfunctions.Result.fromObject({ Value: 'FailureState' }),
      resultPath: '$.result',
    });

    const choice = new stepfunctions.Choice(this, 'Did it work?', {
      inputPath: '$.body',
    });
    const condi1 = stepfunctions.Condition.stringEquals('$.status', 'SUCCESS')
    const cond2 = stepfunctions.Condition.stringEquals('$.status', 'FAIL')


    const definitionState = startState.next(choice
      .when(condi1, successState)
      .when(cond2, failureState))
    
    /*.next(waitState);*/
    
    const logGroup = new logs.LogGroup(this, 'MyLogGroup');

    const stateMachine = new stepfunctions.StateMachine(this, 'CDKStateMachine', {
      definition: definitionState,
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: stepfunctions.LogLevel.ALL,
      },
    })

    const api = new apigateway.StepFunctionsRestApi(this, 'CDKStepFunctionsRestApi', {
      stateMachine: stateMachine
    });    
  }
}
