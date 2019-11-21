/**
 *
 * @param {Number} C 测得的样品溶液中有害物质的浓度， 单位：g/ml
 * @param {Number} V 样品溶液的总体积，单位：ml
 * @param {Number} F 采用流量， 单位：ml/min
 * @param {Number} T 为时间加权平均容许浓度规定的以8h计，单位：min
 */
export function one(C, V, F, T = 480) {
  let result = 0;
  result = ((C * V) / (F * T)) * 1000;
  return result;
}
/**
 *
 * @param {Array} arr1 测得空气中有害物质浓度, 单位：mg/m3
 * @param {Array} arr2 劳动者在相应的有害物质浓度下的工作时间，单位:h
 * @param {Number} T 时间加权平均容许浓度规定的8h
 */
export function two(arr1, arr2, T = 8) {
  let result = 0;
  let length = arr1.length;
  let i = 0;
  let collet = 0;
  while (true) {
    if (i === length) {
      break;
    }
    collet = +(arr1[i] * arr2[i]);
    i++;
  }
  result = collet / T;
  return result;
}

/**
 *
 * @param {Number} C 测得的样品溶液中有害物质的浓度， 单位：g/ml
 * @param {Number} V 样品溶液的体积，单位：ml
 * @param {Number} F 采用流量， 单位：L/min
 * @param {Number} T 采用时间，单位:min
 */
export function three(C, V, F, T) {
  let result = 0;
  result = (C * V) / (F * T);
  return result;
}

/**
 *
 * @param {Number} C 测得的样品溶液中有害物质的浓度， 单位：g/ml
 * @param {Number} V 样品溶液的体积，单位：ml
 * @param {Number} F 采用流量， 单位：L/min
 * @param {Number} T 采用时间，单位:min
 */
export function four(C, V, F, T = 15) {
  let result = 0;
  result = (C * V) / (F * T);
  return result;
}

/**
 *
 * @param {Array} arr1 测得空气中有害物质浓度, 单位：mg/m3
 * @param {Array} arr2 劳动者在相应的有害物质浓度下的工作时间，单位:min
 * @param {Number} T 短时间接触容许浓度规定的15分钟，单位:min
 */
export function five(arr1, arr2, T = 15) {
  let result = 0;
  let length = arr1.length;
  let i = 0;
  let collet = 0;
  while (true) {
    if (i === length) {
      break;
    }
    collet = +(arr1[i] * arr2[i]);
    i++;
  }
  result = collet / T;
  return result;
}

/**
 *
 * @param {Number} C 测得空气中有害物质浓度, 单位：mg/m3
 * @param {Number} T 劳动者在相应的有害物质浓度下的工作时间，单位:min
 */
export function six(C, T) {
  let result = 0;
  result = (C * T) / 15;
  return result;
}

/**
 *
 * @param {Array} K 1/1或1/3倍频程第i频段计权系数
 * @param {Array} L 1/1或1/3倍频程第i频段实测的加速度级均方根值
 * @param {Number} N 1/1或1/3倍频程总频段数
 */
export function seven(K, L, N) {
  let result = 0;
  let i = 0;
  let collet = 0;
  while (true) {
    if (i === K.length) {
      break;
    }
    collet = +Math.pow((K[i] * Math.pow(10, L[i])) / 20, 2);
    i++;
  }
  result = 20 * Math.log(Math.sqrt(collet));
  //   result =
  //     20 * Math.log(Math.sqrt(Math.pow(-1, N) * Math.pow((K * 10 * L) / 20), 2));
  return result;
}

/**
 *
 * @param {Number} a 震动加速度有效值 m/s2
 * @param {Number} a0 震动加速度基准值，a0=10 -6 m/s2
 */
export function eight(a, a0 = Math.pow(10, -6)) {
  let result = 0;
  result = 20 * Math.log(a / a0);
  return result;
}

/**
 *
 * @param {Array} K  1/1或1/3倍频程第i频段计权系数
 * @param {Array} A 1/1或1/3倍频程第i频段加速度均方根值 m/s2
 */
export function nine(K, A) {
  let result = 0;
  let i = 0;
  let collet = 0;
  while (true) {
    if (i === K.length) {
      break;
    }
    collet = +Math.pow(K[i] * Math.pow(10, A[i]), 2);
    i++;
  }
  result = Math.sqrt(collet);
  //   result =
  //     20 * Math.log(Math.sqrt(Math.pow(-1, N) * Math.pow((K * 10 * L) / 20), 2));
  return result;
}

/**
 *
 * @param {Array} Ahw
 * @param {Array} T
 */
export function ten(Ahw, T) {
  let result = 0;
  let i = 0;
  let colletOne = 0;
  let colletTow = 0;
  while (true) {
    if (i === Ahw.length) {
      break;
    }
    colletOne = +Math.pow(Ahw[i], 2) * T[i];
    colletTow = +T[i];
    i++;
  }
  result = Math.sqrt(colletOne / colletTow);
  return result;
}

/**
 *
 * @param {Number} E 电场强度 V/m
 */
export function eleven(E) {
  let result = 0;
  result = Math.pow(E, 2) / 3770;
  return result;
}

/**
 *
 * @param {Number} EA 所测紫外线长波UVA辐射度，W/cm2
 * @param {Number} EB 所测紫外线中波UVB辐射度，W/cm2
 * @param {Number} EC 所测紫外线短波UVC辐射度，W/cm2
 */
export function twelve(EA, EB, EC) {
  let result = 0;
  result = 0.00011 * EA + 0.64 * EB + 0.5 * EC;
  return result;
}

/**
 *
 * @param {Number} A 湿球温度
 * @param {Number} B 黑球温度
 * @param {Number} C 干球温度
 */
export function threeteen(A, B, C) {
  let result = { inHouse: 0, outHouse: 0 };
  result.inHouse = 0.7 * A + 0.2 * B + 0.1 * C;
  result.outHouse = 0.7 * A + 0.3 * B;
  return result;
}

/**
 *
 * @param {Number} T 头 WBGT值
 * @param {Number} F 腹 WBGT值
 * @param {Number} H 踝 WBGT值
 */
export function fourteen(T, F, H) {
  let result = 0;
  result = (T + F + H) / 4;
  return result;
}

/**
 *
 * @param {Array} WBGT
 * @param {Array} T
 */
export function fiveteen(WBGT, T) {
  let result = 0;
  let colletOne = 0;
  let colletTwo = 0;
  let i = 0;
  while (true) {
    if (i === WBGT.length) {
      break;
    }
    colletOne = +(WBGT[i] * T[i]);
    colletTwo = +T[i];
    i++;
  }
  result = colletOne / colletTwo;
  return result;
}

/**
 *
 * @param {Number} T 时间段的总时间
 * @param {Array} TI 时间段
 * @param {Array} LAEQ 时间段等效声级
 */
export function sixteen(T, TI, LAEQ) {
  let result = 0;
  let i = 0;
  let collet = 0;
  while (true) {
    if (i === TI.length) {
      break;
    }
    collet = +TI[i] * Math.pow(10, 0.1 * LAEQ[i]);
    i++;
  }
  result = 10 * Math.log((1 / T) * collet);
  return result;
}

/**
 *
 * @param {Number} LAEQ 实际工作日的等效声效
 * @param {Number} TE 实际工作日的工作时间
 * @param {Number} T0 标准工作日时间
 */
export function seventeen(LAEQ, TE, T0 = 8) {
  let result = 0;
  result = LAEQ + 10 * Math.log(TE / T0);
  return result;
}

/**
 *
 * @param {Array} LEX
 */
export function eighteen(LEX) {
  let result = 0;
  let i = 0;
  let collet = 0;
  while (true) {
    if (i === LEX.length) {
      break;
    }
    collet = +Math.pow(10, 0.1 * LEX[i]);
    i++;
  }
  result = 10 * Math.log((1 / 5) * collet);
  return result;
}

/**
 * 4h等能频率计权振动加速度值 需求看不懂
 * @param {Number} T
 * @param {Number} AHW
 */
export function nineteen(T, AHW) {
  let result = 0;
  result = Math.sqrt(T / 4) * AHW;
  return result;
}

/**
 * 求平均值
 * @param {*} array
 */
export function twoty(array) {
  let result = 0;
  let collet = 0;
  array.map((i) => {
    collet = +i;
  });
  result = collet / array.length;
  return result;
}
