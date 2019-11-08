import { Option } from 'ephox/katamari/api/Option';
import { FutureResult } from 'ephox/katamari/api/FutureResult';
import { Result } from 'ephox/katamari/api/Result';
import fc, { Arbitrary } from 'fast-check';

export const resultError: Arbitrary<Result<string, string>> = fc.string().map((e: string) => Result.error(e));

export const resultValue: Arbitrary<Result<string, string>> = fc.string().map((e: string) => Result.value(e));

export const result = fc.oneof(resultError, resultValue);

const genFutureResultSchema = result.map((result) => {
  const futureResult = FutureResult.nu((callback) => {
    callback(result);
  });

  return {
    futureResult,
    contents: result
  };
});

const genFutureResult = result.map((result) => FutureResult.nu((callback) => {
  callback(result);
}));

export const futureResult = genFutureResult;

export const futureResultSchema = genFutureResultSchema;

export const optionNone = <T> () => fc.constant(Option.none());
export const optionSome = <T> (at: Arbitrary<T>) => at.map(Option.some);

export const option = <T> (at: Arbitrary<T>) => fc.oneof(optionNone(), optionSome(at));

export const negativeInteger = () => fc.integer(Number.MIN_SAFE_INTEGER, -1);
