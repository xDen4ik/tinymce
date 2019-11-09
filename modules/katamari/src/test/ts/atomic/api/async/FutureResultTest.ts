/* tslint:disable:no-unimported-promise */
import { Future } from 'ephox/katamari/api/Future';
import { FutureResult } from 'ephox/katamari/api/FutureResult';
import { Result } from 'ephox/katamari/api/Result';
import * as Fun from 'ephox/katamari/api/Fun';
import fc from 'fast-check';
import { UnitTest, Assert } from '@ephox/bedrock-client';
import { tResult } from 'ephox/katamari/api/ResultInstances';
import { Testable } from '@ephox/dispute';

type Testable<A> = Testable.Testable<A>;

// TODO: move to bedrock
const promiseTest = <A>(name: string, f: () => Promise<A>): void => {
  UnitTest.asynctest(name, (success, failure) => {
    f().then(function () {
      success();
    }, failure);
  });
};

// TODO: move to bedrock
const eqAsync = <A>(label: string, expected: A, actual: A, testableA: Testable<A>, reject: (a: any) => void) => {
  try {
    Assert.eq(label, expected, actual, testableA);
  } catch (e) {
    reject(e);
  }
};

promiseTest('FureResult: pure', () => new Promise(function (resolve, reject) {
  FutureResult.value('future.result.hello').get(function (res) {
    res.fold(function (err) {
      reject('testPure: Unexpected error: ' + err);
    }, function (val) {
      Assert.eq('eq', 'future.result.hello', val);
      resolve(true);
    });
  });
}));

promiseTest('FureResult: error', () => new Promise(function (resolve, reject) {
  FutureResult.error('future.result.error').get(function (res) {
    res.fold(function (err) {
      Assert.eq('eq', 'future.result.error', err);
      resolve(true);
    }, function (val) {
      reject('testError: Unexpected success: ' + val);
    });
  });
}));

promiseTest('FureResult: fromResult', () => new Promise(function (resolve, reject) {
  FutureResult.fromResult(Result.error('future.from.result.error')).get(function (res) {
    res.fold(function (err) {
      Assert.eq('eq', 'future.from.result.error', err);
      resolve(true);
    }, function (val) {
      reject('testFromResult:error: Unexpected success: ' + val);
    });
  });
}));

promiseTest('FureResult: fromFuture', () => new Promise(function (resolve, reject) {
  FutureResult.fromFuture(Future.pure('future.from.future')).get(function (res) {
    res.fold(function (err) {
      reject('testFromFuture: Unexpected error: ' + err);
    }, function (val) {
      Assert.eq('eq', 'future.from.future', val);
      resolve(true);
    });
  });
}));

promiseTest('FureResult: nu', () => new Promise(function (resolve, reject) {
  FutureResult.nu(function (callback) {
    callback(
      Result.value('future.nu')
    );
  }).get(function (res) {
    res.fold(function (err) {
      reject('testNu: Unexpected error: ' + err);
    }, function (val) {
      Assert.eq('eq', 'future.nu', val);
      resolve(true);
    });
  });
}));

promiseTest('FureResult: bindFuture', () => new Promise(function (resolve, reject) {
  const fut = FutureResult.value('10');

  const f = function (x: string) {
    return FutureResult.value(x + '.bind.future');
  };

  fut.bindFuture(f).get(function (output) {
    const value = output.getOrDie();
    Assert.eq('eq', '10.bind.future', value);
    resolve(true);
  });
}));

promiseTest('FureResult: bindFutureError', () => new Promise(function (resolve, reject) {
  let count = 0;

  const fut = FutureResult.nu((callback) => {
    count++;
    callback(Result.error('error'));
  });

  const f = function (x: string) {
    Assert.fail('Should never be invoked');
    return FutureResult.value(x + '.bind.future');
  };

  fut.bindFuture(f).get(function (output) {
    Assert.eq('should only be invoked once not twice', 1, count);
    output.fold(
      (err) => Assert.eq('should contain an error result', 'error', err),
      (_) => Assert.fail('Should never be invoked')
    );

    resolve(true);
  });
}));

promiseTest('FureResult: bindResult', () => new Promise(function (resolve, reject) {
  const fut = FutureResult.value('10');

  const f = function (x) {
    return Result.value(x + '.bind.result');
  };

  fut.bindResult(f).get(function (output) {
    const value = output.getOrDie();
    Assert.eq('eq', '10.bind.result', value);
    resolve(true);
  });
}));

promiseTest('FureResult: mapResult', () => new Promise(function (resolve, reject) {
  const fut = FutureResult.value('10');

  const f = function (x) {
    return x + '.map.result';
  };

  fut.mapResult(f).get(function (output) {
    const value = output.getOrDie();
    Assert.eq('eq', '10.map.result', value);
    resolve(true);
  });
}));

promiseTest('FureResult: mapError', () => new Promise(function (resolve, reject) {
  const fut = FutureResult.error('10');

  const f = function (x) {
    return x + '.map.result';
  };

  fut.mapError(f).get(function (output) {
    const error = output.fold(Fun.identity, Fun.identity);
    Assert.eq('eq', '10.map.result', error);
    resolve(true);
  });
}));

promiseTest('FureResult: FutureResult.value resolves with data', () => {
  return fc.assert(fc.asyncProperty(fc.integer(), (i) => {
    return new Promise((resolve, reject) => {
      FutureResult.value(i).get((ii) => {
        eqAsync('eq', Result.value(i), ii, tResult(), reject);
        resolve();
      });
    });
  }));
});

/*
promiseTest('', () => {
  return fc.assert(fc.asyncProperty(fc.integer(), (i) => {
    return new Promise((resolve, reject) => {

    });
  }));
});
*/

promiseTest('FutureResult.value mapResult f resolves with f data', () => {
  const f = (x) => x + 3;
  return fc.assert(fc.asyncProperty(fc.integer(), (i) => {
    return new Promise((resolve, reject) => {
      FutureResult.value(i).mapResult(f).get((ii) => {
        eqAsync('eq', Result.value(f(i)), ii, tResult(), reject);
        resolve();
      });
    });
  }));
});

// promiseTest('futureResult.bind(binder) equiv futureResult.get(bind)', () => {
//   return fc.assert(fc.asyncProperty(fc.integer(), (i) => {
//     return new Promise((resolve, reject) => {
//
//     });
//   }));
// });

//       {
//         label: 'futureResult.bind(binder) equiv futureResult.get(bind)',
//         arbs: [ ArbDataTypes.futureResultSchema, fc.func(ArbDataTypes.futureResult) ],
//         f(arbF, binder) {
//           return AsyncProps.futureToPromise(arbF.futureResult.bindFuture(binder)).then(function (data) {
//             return new Promise(function (resolve, reject) {
//
//               const comparison = Results.compare(arbF.contents, data);
//               comparison.match({
//                 // input was error
//                 // bind result was error
//                 // so check that the error strings are the same (i.e. binder didn't run)
//                 bothErrors(errInit, errBind) {
//                   Assert.eq('eq', 'eq', errInit, errBind) ? resolve(true) : reject('Both were errors, but the errors did not match');
//                 },
//
//                 // input was error
//                 // bind result was value
//                 // something is wrong.
//                 firstError(errInit, valBind) {
//                   reject('Initially, you had an error, but after bind you received a value');
//                 },
//
//                 // input was value
//                 // bind result was error
//                 // something is right if binder(value) === error
//                 secondError(valInit, errBind) {
//                   // check that bind did not do that.
//                   binder(valInit).toLazy().get(function (resF) {
//                     resF.fold(function (errF) {
//                       // binding original value resulted in error, so check error
//                       Assert.eq('eq', 'eq', errBind, errF) ? resolve(true) : reject('Both bind results were errors, but the errors did not match');
//                     }, function (valF) {
//                       // binding original value resulted in value, so this path is wrong
//                       reject('After binding the value, bindFuture should be a value, but it is an error');
//                     });
//                   });
//                 },
//                 bothValues(valInit, valBind) {
//                   // input was value
//                   // bind result was value
//                   // something is right if binder(value) === value
//                   binder(valInit).toLazy().get(function (resF) {
//                     resF.fold(function (errF) {
//                       reject(
//                         'After binding the value, bindFuture should be a error: ' + errF + ', but was value: ' + valBind
//                       );
//                     }, function (valF) {
//                       Assert.eq('eq', 'eq', valBind, valF) ? resolve(true) : reject(
//                         'Both bind results were values, but the values did not match\n' +
//                         'First: ' + valBind + '\n' +
//                         'Second: ' + valF
//                       );
//                     });
//                   });
//                 }
//               });
//             });
//           });
//         }
//       },
//       {
//         label: 'futureResult.bindResult equiv binding original value',
//         arbs: [ ArbDataTypes.futureResultSchema, fc.func(ArbDataTypes.result) ],
//         f(arbF, resultBinder) {
//           return AsyncProps.futureToPromise(arbF.futureResult.bindResult(resultBinder)).then(function (data) {
//             return new Promise(function (resolve, reject) {
//               const comparison = Results.compare(arbF.contents, data);
//               comparison.match({
//                 // input was error
//                 // bind result was error
//                 // so check that the error strings are the same (i.e. binder didn't run)
//                 bothErrors(errInit, errBind) {
//                   Assert.eq('eq', 'eq', errInit, errBind) ? resolve(true) : reject('Both were errors, but the errors did not match');
//                 },
//
//                 // input was error
//                 // bind result was value
//                 // something is wrong.
//                 firstError(errInit, valBind) {
//                   reject('Initially, you had an error, but after bind you received a value');
//                 },
//
//                 // input was value
//                 // bind result was error
//                 // something is right if binder(value) === error
//                 secondError(valInit, errBind) {
//                   // check that bind did not do that.
//                   resultBinder(valInit).fold(function (errF) {
//                     // binding original value resulted in error, so check error
//                     Assert.eq('eq', 'eq', errBind, errF) ? resolve(true) : reject('Both bind results were errors, but the errors did not match');
//                   }, function (valF) {
//                     // binding original value resulted in value, so this path is wrong
//                     reject('After binding the value, bindFuture should be a value, but it is an error');
//                   });
//                 },
//                 bothValues(valInit, valBind) {
//                   // input was value
//                   // bind result was value
//                   // something is right if binder(value) === value
//                   resultBinder(valInit).fold(function (errF) {
//                     reject(
//                       'After binding the value, bindFuture should be a error: ' + errF + ', but was value: ' + valBind
//                     );
//                   }, function (valF) {
//                     Assert.eq('eq', 'eq', valBind, valF) ? resolve(true) : reject(
//                       'Both bind results were values, but the values did not match\n' +
//                       'First: ' + valBind + '\n' +
//                       'Second: ' + valF
//                     );
//                   });
//                 }
//               });
//             });
//           });
//         }
//       },
//
//       {
//         label: 'futureResult.mapResult equiv mapping original result',
//         arbs: [ ArbDataTypes.futureResultSchema, fc.func(fc.json()) ],
//         f(arbF, resultMapper) {
//           return AsyncProps.futureToPromise(arbF.futureResult.mapResult(resultMapper)).then(function (data) {
//             return new Promise(function (resolve, reject) {
//               const comparison = Results.compare(arbF.contents, data);
//               comparison.match({
//                 // input was error
//                 // bind result was error
//                 // so check that the error strings are the same (i.e. binder didn't run)
//                 bothErrors(errInit, errBind) {
//                   Assert.eq('eq', 'eq', errInit, errBind) ? resolve(true) : reject('Both were errors, but the errors did not match');
//                 },
//
//                 // input was error
//                 // bind result was value
//                 // something is wrong.
//                 firstError(errInit, valBind) {
//                   reject('Initially, you had an error, but after bind you received a value');
//                 },
//
//                 // input was value
//                 // bind result was error
//                 // something is wrong because you can't map to an error
//                 secondError(valInit, errBind) {
//                   reject('Initially you had a value, so you cannot map to an error');
//                 },
//                 bothValues(valInit, valBind) {
//                   // input was value
//                   // bind result was value
//                   // something is right if mapper(value) === value
//                   const valF = resultMapper(valInit);
//                   Assert.eq('eq', 'eq', valBind, valF) ? resolve(true) : reject(
//                     'Mapper results did not match\n' +
//                     'First: ' + valBind + '\n' +
//                     'Second: ' + valF
//                   );
//                 }
//               });
//             });
//           });
//         }
//       }
//     ]);
//   };
// }));
