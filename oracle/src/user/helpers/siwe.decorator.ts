import {createParamDecorator, ExecutionContext, Injectable} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
export const Siwe = createParamDecorator(

    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req
        return request.ssx.siwe;
    },
);