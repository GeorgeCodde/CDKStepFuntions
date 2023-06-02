#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStepFuntionStack } from '../lib/cdk_step_funtion-stack';
require('dotenv').config();

const app = new cdk.App();
new CdkStepFuntionStack(app, 'CdkStepFuntionStack', {});