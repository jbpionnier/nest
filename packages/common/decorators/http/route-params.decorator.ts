import { ROUTE_ARGS_METADATA } from '../../constants';
import { RouteParamtypes } from '../../enums/route-paramtypes.enum';
import { PipeTransform } from '../../index';
import { Type } from '../../interfaces';
import { isNil, isString } from '../../utils/shared.utils';

export type ParamData = object | string | number;
export interface RouteParamMetadata {
  index: number;
  data?: ParamData;
}

export function assignMetadata<TParamtype = any, TArgs = any>(
  args: TArgs,
  paramtype: TParamtype,
  index: number,
  data?: ParamData,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) {
  return {
    ...args,
    [`${paramtype}:${index}`]: {
      index,
      data,
      pipes,
    },
  };
}

const createRouteParamDecorator = (paramtype: RouteParamtypes) => {
  return (data?: ParamData): ParameterDecorator => (target, key, index) => {
    const args =
      Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignMetadata<RouteParamtypes, Record<number, RouteParamMetadata>>(
        args,
        paramtype,
        index,
        data,
      ),
      target.constructor,
      key,
    );
  };
};

const createPipesRouteParamDecorator = (paramtype: RouteParamtypes) => (
  data?: any,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator => (target, key, index) => {
  const args =
    Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
  const hasParamData = isNil(data) || isString(data);
  const paramData = hasParamData ? data : undefined;
  const paramPipes = hasParamData ? pipes : [data, ...pipes];

  Reflect.defineMetadata(
    ROUTE_ARGS_METADATA,
    assignMetadata(args, paramtype, index, paramData, ...paramPipes),
    target.constructor,
    key,
  );
};

/**
 * Route handler parameter decorator. Extracts the `Request`
 * object from the underlying platform and populates the decorated
 * parameter with the value of `Request`.
 *
 * Example: `logout(@Request() req)`
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export const Request: () => ParameterDecorator = createRouteParamDecorator(
  RouteParamtypes.REQUEST,
);

/**
 * Route handler parameter decorator. Extracts the `Response`
 * object from the underlying platform and populates the decorated
 * parameter with the value of `Response`.
 *
 * Example: `logout(@Response() res)`
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export const Response: () => ParameterDecorator = createRouteParamDecorator(
  RouteParamtypes.RESPONSE,
);

/**
 * Route handler parameter decorator. Extracts reference to the `Next` function
 * from the underlying platform and populates the decorated
 * parameter with the value of `Next`.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export const Next: () => ParameterDecorator = createRouteParamDecorator(
  RouteParamtypes.NEXT,
);

/**
 * Route handler parameter decorator. Extracts the `Session` object
 * from the underlying platform and populates the decorated
 * parameter with the value of `Session`.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export const Session: () => ParameterDecorator = createRouteParamDecorator(
  RouteParamtypes.SESSION,
);

/**
 * Route handler parameter decorator. Extracts the `file` object
 * and populates the decorated parameter with the value of `file`.
 * Used in conjunction with
 * [multer middleware](https://github.com/expressjs/multer).
 *
 * For example:
 * ```typescript
 * uploadFile(@UploadedFile() file) {
 *   console.log(file);
 * }
 * ```
 * @see [Request object](https://docs.nestjs.com/techniques/file-upload)
 *
 * @publicApi
 */
export const UploadedFile: (
  fileKey?: string,
) => ParameterDecorator = createRouteParamDecorator(RouteParamtypes.FILE);

/**
 * Route handler parameter decorator. Extracts the `files` object
 * and populates the decorated parameter with the value of `files`.
 * Used in conjunction with
 * [multer middleware](https://github.com/expressjs/multer).
 *
 * For example:
 * ```typescript
 * uploadFile(@UploadedFiles() files) {
 *   console.log(files);
 * }
 * ```
 * @see [Request object](https://docs.nestjs.com/techniques/file-upload)
 *
 * @publicApi
 */
export const UploadedFiles: () => ParameterDecorator = createRouteParamDecorator(
  RouteParamtypes.FILES,
);
/**
 * Route handler parameter decorator. Extracts the `headers`
 * property from the `req` object and populates the decorated
 * parameter with the value of `headers`.
 *
 * For example: `async update(@Headers('Cache-Control') cacheControl: string)`
 *
 * @param property name of single header property to extract.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export const Headers: (
  property?: string,
) => ParameterDecorator = createRouteParamDecorator(RouteParamtypes.HEADERS);

/**
 * Route handler parameter decorator. Extracts the `query`
 * property from the `req` object and populates the decorated
 * parameter with the value of `query`. May also apply pipes to the bound
 * query parameter.
 *
 * For example:
 * ```typescript
 * async find(@Query('user') user: string)
 * ```
 *
 * @param property name of single property to extract from the `query` object
 * @param pipes one or more pipes to apply to the bound query parameter
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export function Query(): ParameterDecorator;
/**
 * Route handler parameter decorator. Extracts the `query`
 * property from the `req` object and populates the decorated
 * parameter with the value of `query`. May also apply pipes to the bound
 * query parameter.
 *
 * For example:
 * ```typescript
 * async find(@Query('user') user: string)
 * ```
 *
 * @param property name of single property to extract from the `query` object
 * @param pipes one or more pipes to apply to the bound query parameter
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export function Query(
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
/**
 * Route handler parameter decorator. Extracts the `query`
 * property from the `req` object and populates the decorated
 * parameter with the value of `query`. May also apply pipes to the bound
 * query parameter.
 *
 * For example:
 * ```typescript
 * async find(@Query('user') user: string)
 * ```
 *
 * @param property name of single property to extract from the `query` object
 * @param pipes one or more pipes to apply to the bound query parameter
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export function Query(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
/**
 * Route handler parameter decorator. Extracts the `query`
 * property from the `req` object and populates the decorated
 * parameter with the value of `query`. May also apply pipes to the bound
 * query parameter.
 *
 * For example:
 * ```typescript
 * async find(@Query('user') user: string)
 * ```
 *
 * @param property name of single property to extract from the `query` object
 * @param pipes one or more pipes to apply to the bound query parameter
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export function Query(
  property?: string | (Type<PipeTransform> | PipeTransform),
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.QUERY)(
    property,
    ...pipes,
  );
}

/**
 * Route handler parameter decorator. Extracts the entire `body`
 * object from the `req` object and populates the decorated
 * parameter with the value of `body`.
 *
 * For example:
 * ```typescript
 * async create(@Body() cat: CreateCatDto)
 * ```
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 *
 * @publicApi
 */
export function Body(): ParameterDecorator;

/**
 * Route handler parameter decorator. Extracts the entire `body`
 * object from the `req` object and populates the decorated
 * parameter with the value of `body`. Also applies the specified
 * pipes to that parameter.
 *
 * For example:
 * ```typescript
 * async create(@Body(new ValidationPipe()) cat: CreateCatDto)
 * ```
 *
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound body parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Body(
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

/**
 * Route handler parameter decorator. Extracts a single property from
 * the `body` object property of the `req` object and populates the decorated
 * parameter with the value of that property. Also applies pipes to the bound
 * body parameter.
 *
 * For example:
 * ```typescript
 * async create(@Body('role', new ValidationPipe()) role: string)
 * ```
 *
 * @param property name of single property to extract from the `body` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound body parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Body(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

/**
 * Route handler parameter decorator. Extracts the entire `body` object
 * property, or optionally a named property of the `body` object, from
 * the `req` object and populates the decorated parameter with that value.
 * Also applies pipes to the bound body parameter.
 *
 * For example:
 * ```typescript
 * async create(@Body('role', new ValidationPipe()) role: string)
 * ```
 *
 * @param property name of single property to extract from the `body` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound body parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Body(
  property?: string | (Type<PipeTransform> | PipeTransform),
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.BODY)(
    property,
    ...pipes,
  );
}

/**
 * Route handler parameter decorator. Extracts the `params`
 * property from the `req` object and populates the decorated
 * parameter with the value of `params`. May also apply pipes to the bound
 * parameter.
 *
 * For example, extracting all params:
 * ```typescript
 * findOne(@Param() params: string[])
 * ```
 *
 * For example, extracting a single param:
 * ```typescript
 * findOne(@Param('id') id: string)
 * ```
 * @param property name of single property to extract from the `req` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Param(): ParameterDecorator;
/**
 * Route handler parameter decorator. Extracts the `params`
 * property from the `req` object and populates the decorated
 * parameter with the value of `params`. May also apply pipes to the bound
 * parameter.
 *
 * For example, extracting all params:
 * ```typescript
 * findOne(@Param() params: string[])
 * ```
 *
 * For example, extracting a single param:
 * ```typescript
 * findOne(@Param('id') id: string)
 * ```
 * @param property name of single property to extract from the `req` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Param(
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
/**
 * Route handler parameter decorator. Extracts the `params`
 * property from the `req` object and populates the decorated
 * parameter with the value of `params`. May also apply pipes to the bound
 * parameter.
 *
 * For example, extracting all params:
 * ```typescript
 * findOne(@Param() params: string[])
 * ```
 *
 * For example, extracting a single param:
 * ```typescript
 * findOne(@Param('id') id: string)
 * ```
 * @param property name of single property to extract from the `req` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Param(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
/**
 * Route handler parameter decorator. Extracts the `params`
 * property from the `req` object and populates the decorated
 * parameter with the value of `params`. May also apply pipes to the bound
 * parameter.
 *
 * For example, extracting all params:
 * ```typescript
 * findOne(@Param() params: string[])
 * ```
 *
 * For example, extracting a single param:
 * ```typescript
 * findOne(@Param('id') id: string)
 * ```
 * @param property name of single property to extract from the `req` object
 * @param pipes one or more pipes - either instances or classes - to apply to
 * the bound parameter.
 *
 * @see [Request object](https://docs.nestjs.com/controllers#request-object)
 * @see [Working with pipes](https://docs.nestjs.com/custom-decorators#working-with-pipes)
 *
 * @publicApi
 */
export function Param(
  property?: string | (Type<PipeTransform> | PipeTransform),
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return createPipesRouteParamDecorator(RouteParamtypes.PARAM)(
    property,
    ...pipes,
  );
}

export const Req = Request;
export const Res = Response;
