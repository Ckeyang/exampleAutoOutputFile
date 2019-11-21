let yj = [
  // { key: 'name', name: '内容' },
  // { key: 'businessName', name: '涉及业务' },
  // { key: 'categoryNameList', name: '涉及类别' },
  // { key: 'industryNameList', name: '涉及行业' },
  { key: 'substanceNameList', name: '涉及物质' }
];
let pj = [
  { key: 'evaluatioName', name: '名称' },
  { key: 'categoryNameList', name: '类别' },
  { key: 'evaluationMethodSize', name: '评价方法数量' }
];
let wz = [
  { key: 'substanceCategoryType', name: '物质类别' },
  { key: 'name', name: '物质名称' },
  { key: 'casNo', name: 'CasNo' },
  { key: 'formula', name: '分子式' },
  { key: 'alias', name: '别名' },
  { key: 'mac', name: '化学限值MAC' },
  { key: 'el', name: 'EL' },
  { key: 'pcstel', name: '化学限值PC-STEL' },
  { key: 'pctwa', name: '化学限值PC-TWA' },
  { key: 'pctwaRespirableDust', name: 'PC-TWA呼尘' },
  { key: 'pctwaTotalDust', name: 'PC-TWA总尘' },
  { key: 'idlhConcentration', name: 'IDLH浓度' },
  { key: 'firstGrade$100', name: '高温劳动强度WBGT限值（℃）Ⅰ级100%接触时间' },
  { key: 'secondGrade$100', name: '高温劳动强度WBGT限值（℃）Ⅱ级100%接触时间' },
  { key: 'thirdGrade$100', name: '高温劳动强度WBGT限值（℃）Ⅲ级100%接触时间' },
  { key: 'fourthGrade$100', name: '高温劳动强度WBGT限值（℃）Ⅳ级100%接触时间' },
  { key: 'firstGrade$75', name: '高温劳动强度WBGT限值（℃）Ⅰ级75%接触时间' },
  { key: 'secondGrade$75', name: '高温劳动强度WBGT限值（℃）Ⅱ级75%接触时间' },
  { key: 'thirdGrade$75', name: '高温劳动强度WBGT限值（℃）Ⅲ级75%接触时间' },
  { key: 'fourthGrade$75', name: '高温劳动强度WBGT限值（℃）Ⅳ级75%接触时间' },
  { key: 'firstGrade$50', name: '高温劳动强度WBGT限值（℃）Ⅰ级50%接触时间' },
  { key: 'secondGrade$50', name: '高温劳动强度WBGT限值（℃）Ⅱ级50%接触时间' },
  { key: 'thirdGrade$50', name: '高温劳动强度WBGT限值（℃）Ⅲ级50%接触时间' },
  { key: 'fourthGrade$50', name: '高温劳动强度WBGT限值（℃）Ⅳ级50%接触时间' },
  { key: 'firstGrade$25', name: '高温劳动强度WBGT限值（℃）Ⅰ级25%接触时间' },
  { key: 'secondGrade$25', name: '高温劳动强度WBGT限值（℃）Ⅱ级25%接触时间' },
  { key: 'thirdGrade$25', name: '高温劳动强度WBGT限值（℃）Ⅲ级25%接触时间' },
  { key: 'fourthGrade$25', name: '高温劳动强度WBGT限值（℃）Ⅳ级25%接触时间' },
  { key: 'contactTimeLimit', name: '噪声职业接触时间限值dB（A）' },
  { key: 'lexOfEightHours', name: 'LEX,8H dB（A）' },
  { key: 'lexOfWeek', name: 'LEX ,w dB（A）' },
  {
    key: 'spl$100',
    name: '工作场所脉冲噪声职业接触限值声压级峰值dB(A)（脉冲次数n ≤ 100）'
  },
  {
    key: 'spl$100_1000',
    name: '工作场所脉冲噪声职业接触限值声压级峰值dB(A)（100＜脉冲次数n ≤ 1000）'
  },
  {
    key: 'spl$1000_10000',
    name:
      '工作场所脉冲噪声职业接触限值声压级峰值dB(A)（1000＜脉冲次数n ≤ 10000）'
  },
  { key: 'noiseWorkshopOfficeNoiseLevel', name: '噪声车间办公室噪声声级dB(A)' },
  {
    key: 'noiseWorkshopOfficeLimitOfErgonomics',
    name: '噪声车间办公室工效限值dB(A)'
  },
  {
    key: 'nonNoiseWorkshopOfficeNoiseLevel',
    name: '非噪声车间办公室噪声声级dB(A)'
  },
  {
    key: 'nonNoiseWorkshopOfficeLimitOfErgonomics',
    name: '非噪声车间办公室工效限值dB(A)'
  },
  { key: 'conferenceRoomNoiseLevel', name: '会议室噪声声级dB(A)' },
  { key: 'conferenceRoomLimitOfErgonomics', name: '会议室工效限值dB(A)' },
  {
    key: 'cwPowerDensity$8H',
    name: '超高频辐射限值8H连续波功率密度（mW/cm2）'
  },
  {
    key: 'cwElectricFieldIntensity$8H',
    name: '超高频辐射限值8H连续波电场强度（V/m）'
  },
  {
    key: 'pulsePowerDensity$8H',
    name: '超高频辐射限值8H脉冲波功率密度（mW/cm2）'
  },
  {
    key: 'electricFieldIntensityOfPulseWave$8H',
    name: '超高频辐射限值8H脉冲波电场强度（V/m）'
  },
  {
    key: 'cwPowerDensity$4H',
    name: '超高频辐射限值4H连续波功率密度（mW/cm2）'
  },
  {
    key: 'cwElectricFieldIntensity$4H',
    name: '超高频辐射限值4H连续波电场强度（V/m）'
  },
  {
    key: 'pulsePowerDensity$4H',
    name: '超高频辐射限值4H脉冲波功率密度（mW/cm2）'
  },
  {
    key: 'electricFieldIntensityOfPulseWave$4H',
    name: '超高频辐射限值4H脉冲波电场强度（V/m）'
  },
  {
    key: 'electricFieldIntensityBetweenOfZeroPointOneAndThree',
    name: '高频电磁场频率0.1≤f≤3.0电场强度（V/m）'
  },
  {
    key: 'magneticFieldIntensityBetweenOfZeroPointOneAndThree',
    name: '高频电磁场频率0.1≤f≤3.0磁场强度（A/m）'
  },
  {
    key: 'electricFieldIntensityBetweenOfThreeAndThirty',
    name: '高频电磁场频率3.0＜f≤30电场强度（V/m）'
  },
  {
    key: 'uvbIrradianceOfWorkDay',
    name: '紫外辐射中波紫外线（280nm≤λ＜315nm）8H辐照度（μW/cm2）'
  },
  {
    key: 'uvbExposureOfWorkDay',
    name: '紫外辐射中波紫外线（280nm≤λ＜315nm）8H照射量（mJ/cm2）'
  },
  {
    key: 'uvcIrradianceOfWorkDay',
    name: '紫外辐射短波紫外线（100nm≤λ＜280nm）8H辐照度（μW/cm2）'
  },
  {
    key: 'uvcExposureOfWorkDay',
    name: '紫外辐射短波紫外线（100nm≤λ＜280nm）8H照射量（mJ/cm2）'
  },
  {
    key: 'arcWeldingLightIrradianceOfWorkDay',
    name: '电焊弧光8H辐照度（μW/cm2）'
  },
  {
    key: 'arcWeldingLightExposureOfWorkDay',
    name: '电焊弧光8H照射量（mJ/cm2）'
  },
  {
    key: 'arcWelding$365IrradianceOfWorkDay',
    name: '电焊弧光(波段=365)8H辐照度（μW/cm2）'
  },
  {
    key: 'arcWelding$365ExposureOfWorkDay',
    name: '电焊弧光(波段=365)8H照射量（mJ/cm2）'
  },
  {
    key: 'arcWelding$290IrradianceOfWorkDay',
    name: '电焊弧光(波段=290)8H辐照度（μW/cm2）'
  },
  {
    key: 'arcWelding$290ExposureOfWorkDay',
    name: '电焊弧光(波段=290)8H照射量（mJ/cm2）'
  },
  {
    key: 'arcWelding$254IrradianceOfWorkDay',
    name: '电焊弧光(波段=254)8H辐照度（μW/cm2）'
  },
  {
    key: 'arcWelding$254ExposureOfWorkDay',
    name: '电焊弧光(波段=254)8H照射量（mJ/cm2）'
  },
  {
    key: 'microwaveOfContinuousDailyDose',
    name: '微波辐射限值连续微波日剂量(μW•h/cm2)'
  },
  {
    key: 'microwaveOfPulseDailyDose',
    name: '微波辐射限值脉冲微波日剂量(μW•h/cm2)'
  },
  {
    key: 'microwaveOfContinuousOrPulseDailyDose',
    name: '微波辐射限值连续微波或脉冲微波日剂量(μW•h/cm2)'
  },
  {
    key: 'microwaveOfContinuousAveragePowerDensityOfWorkday',
    name: '微波辐射限值连续微波8h平均功率密度(μW/cm2)'
  },
  {
    key: 'microwaveOfPulseAveragePowerDensityOfWorkday',
    name: '微波辐射限值脉冲微波8h平均功率密度(μW/cm2)'
  },
  {
    key: 'microwaveOfContinuousOrPulseAveragePowerDensityOfWorkday',
    name: '微波辐射限值连续微波或脉冲微波8h平均功率密度(μW/cm2)'
  },
  {
    key: 'microwaveOfContinuousNonAveragePowerDensityOfWorkday',
    name: '微波辐射限值连续微波非8h平均功率密度(μW/cm2)'
  },
  {
    key: 'microwaveOfPulseNonAveragePowerDensityOfWorkday',
    name: '微波辐射限值脉冲微波非8h平均功率密度(μW/cm2)'
  },
  {
    key: 'microwaveOfContinuousOrPulseNonAveragePowerDensityOfWorkday',
    name: '微波辐射限值连续微波或脉冲微波非8h平均功率密度(μW/cm2)'
  },
  {
    key: 'microwaveOfContinuousContactPowerDensityOfShortTime',
    name: '微波辐射限值连续微波短时间接触功率密度(mW/cm2)'
  },
  {
    key: 'microwaveOfPulseContactPowerDensityOfShortTime',
    name: '微波辐射限值脉冲微波短时间接触功率密度(mW/cm2)'
  },
  {
    key: 'microwaveOfContinuousOrPulseContactPowerDensityOfShortTime',
    name: '微波辐射限值连续微波或脉冲微波短时间接触功率密度(mW/cm2)'
  },
  {
    key: 'equalEnergyVibrationalAccelerationLimitOfFourHour',
    name: '手传振动4h等能量频率计权振动加速度限值（m/s²）'
  },
  {
    key: 'equalEnergyVibrationalAccelerationLimit',
    name: '手传振动等能量频率计权振动加速度限值（m/s²）'
  },
  {
    key: 'electricFieldIntensity$50HZ',
    name: '工频电场频率50Hz的电场强度（kV／m）'
  },
  { key: 'biologyMac', name: '生物限值MAC' },
  { key: 'biologyPctwa', name: '生物限值PC-TWA' },
  { key: 'biologyPcstel', name: '生物限值PC-STEL' }
];
let sb = [
  { key: 'equipmentName', name: '仪器设备名称' },
  { key: 'serialNum', name: '仪器管理编号' },
  { key: 'specification', name: '规格型号' },
  { key: 'manufacturer', name: '生产厂家' },
  { key: 'manufactureSerialNum', name: '出厂编号' },
  { key: 'arrivalDate', name: '到货时间' }
];
let cy = [
  { key: 'categoryName', name: '所属检查分类' },
  { key: 'name', name: '采样方法名称' }
];
let titleList = {
  ACCORDINGLIBRARY: yj,
  EVALUATIONMETHODLIBRARY: pj,
  MATERIALDATA: wz,
  MATERIALFACTORSLIST: wz,
  EQUIPMENTLIST: sb,
  SAMPLINGMETHOD: cy
};
export function getTitle(param) {
  return titleList[param] || [];
}
