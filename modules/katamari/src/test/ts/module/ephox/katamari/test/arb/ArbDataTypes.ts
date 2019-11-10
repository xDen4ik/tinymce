import { Option } from 'ephox/katamari/api/Option';
import { Result } from 'ephox/katamari/api/Result';
import fc, { Arbitrary } from 'fast-check';

export const arbResultError = <A, E> (arbE: Arbitrary<E>): Arbitrary<Result<A, E>> =>
  arbE.map(Result.error);

export const arbResultValue = <A, E> (arbA: Arbitrary<A>): Arbitrary<Result<A, E>> =>
  arbA.map(Result.value);

export const arbResult = <A, E> (arbA: Arbitrary<A>, arbE: Arbitrary<E>): Arbitrary<Result<A, E>> =>
  fc.oneof(arbResultError<A, E>(arbE), arbResultValue<A, E>(arbA));

export const arbOptionNone = <T> () => fc.constant(Option.none());
export const arbOptionSome = <T> (at: Arbitrary<T>) => at.map(Option.some);

export const arbOption = <T> (at: Arbitrary<T>) => fc.oneof(arbOptionNone(), arbOptionSome(at));

export const arbNegativeInteger = () => fc.integer(Number.MIN_SAFE_INTEGER, -1);
