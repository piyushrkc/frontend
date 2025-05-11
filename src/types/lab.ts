// Lab Test Types
export type LabTest = {
  id: string;
  patient: {
    id: string;
    name: string;
    contactNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  orderedBy: {
    id: string;
    name: string;
    specialization?: string;
  };
  testType: string;
  testCategory?: LabTestCategory;
  description?: string;
  specialInstructions?: string;
  urgency?: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled';
  orderedAt: string;
  collectedAt?: string;
  processedBy?: string;
  completedAt?: string;
  result?: LabResult;
};

export type LabResult = {
  id: string;
  labTest: string;
  findings: Record<string, any>;
  interpretation?: string;
  normalRanges?: Record<string, ReferenceRange>;
  recommendations?: string;
  enteredBy: string;
  enteredAt: string;
  updatedBy?: string;
  updatedAt?: string;
  isAbnormal?: boolean;
  abnormalParameters?: string[];
  attachments?: string[];
};

export type LabTestCategory = 
  | 'CBC' 
  | 'LFT' 
  | 'KFT' 
  | 'LIPID' 
  | 'THYROID' 
  | 'DIABETES' 
  | 'CARDIAC' 
  | 'ELECTROLYTES' 
  | 'IRON' 
  | 'COAGULATION' 
  | 'URINALYSIS' 
  | 'OTHER';

// Reference range with gender-specific values
export type ReferenceRange = {
  unit: string;
  male?: {
    min: number;
    max: number;
  };
  female?: {
    min: number;
    max: number;
  };
  common?: {
    min: number;
    max: number;
  };
  description?: string;
};

// Result flags
export type LabResultFlag = 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';

// Parameter structure for lab tests
export type LabParameter = {
  id: string;
  name: string;
  code?: string;
  category: LabTestCategory;
  referenceRange: ReferenceRange;
  description?: string;
  order?: number;
};

// Complete Blood Count parameters
export type CBCParameters = {
  hemoglobin: number; 
  redBloodCellCount: number;
  whiteBloodCellCount: number;
  neutrophils: number;
  lymphocytes: number;
  monocytes: number;
  eosinophils: number;
  basophils: number;
  absoluteNeutrophilCount?: number;
  absoluteLymphocyteCount?: number;
  absoluteMonocyteCount?: number;
  absoluteEosinophilCount?: number;
  absoluteBasophilCount?: number;
  plateletCount: number;
  hematocrit: number;
  mcv: number;
  mch: number;
  mchc: number;
  rdw: number;
  mpv?: number;
};

// Liver Function Test parameters
export type LFTParameters = {
  alt: number;
  ast: number;
  alp: number;
  ggt: number;
  totalBilirubin: number;
  directBilirubin: number;
  indirectBilirubin?: number;
  totalProtein: number;
  albumin: number;
  globulin?: number;
  albuminGlobulinRatio?: number;
  ldh?: number;
};

// Kidney Function Test parameters
export type KFTParameters = {
  bloodUreaNitrogen: number;
  serumCreatinine: number;
  egfr?: number;
  uricAcid: number;
  bunCreatinineRatio?: number;
  cystatinC?: number;
};

// Lipid Profile parameters
export type LipidParameters = {
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  vldlCholesterol?: number;
  triglycerides: number;
  nonHdlCholesterol?: number;
  totalCholesterolHdlRatio?: number;
  ldlHdlRatio?: number;
};

// Thyroid Function Test parameters
export type ThyroidParameters = {
  tsh: number;
  freeT4?: number;
  freeT3?: number;
  totalT4?: number;
  totalT3?: number;
  tpoAntibodies?: number;
  tgAntibodies?: number;
  tsi?: number;
  reverseT3?: number;
};

// Diabetes Test parameters
export type DiabetesParameters = {
  fastingBloodGlucose?: number;
  randomBloodGlucose?: number;
  postprandialGlucose?: number;
  ogtt?: number;
  hba1c: number;
  fructosamine?: number;
  cPeptide?: number;
  insulinLevel?: number;
  homaIr?: number;
};

// Cardiac Test parameters
export type CardiacParameters = {
  troponinI?: number;
  troponinT?: number;
  ck?: number;
  ckMb?: number;
  ckMbIndex?: number;
  myoglobin?: number;
  bnp?: number;
  ntProBnp?: number;
  hsCrp?: number;
  homocysteine?: number;
};

// Electrolytes and Minerals parameters
export type ElectrolytesParameters = {
  sodium: number;
  potassium: number;
  chloride: number;
  bicarbonate: number;
  calcium: number;
  ionizedCalcium?: number;
  phosphorus?: number;
  magnesium?: number;
};

// Iron Studies parameters
export type IronParameters = {
  serumIron: number;
  tibc: number;
  transferrin?: number;
  ferritin: number;
  transferrinSaturation?: number;
};

// Coagulation Studies parameters
export type CoagulationParameters = {
  pt?: number;
  inr?: number;
  ptt?: number;
  aptt?: number;
  bleedingTime?: number;
  clottingTime?: number;
  dDimer?: number;
  fibrinogen?: number;
  thrombinTime?: number;
};

// Input Types
export type LabTestInput = {
  patientId: string;
  testType: string;
  testCategory?: LabTestCategory;
  description?: string;
  specialInstructions?: string;
  urgency?: 'routine' | 'urgent' | 'stat';
};

export type LabResultInput = {
  labTestId: string;
  findings: Record<string, any>;
  interpretation?: string;
  recommendations?: string;
  isAbnormal?: boolean;
  abnormalParameters?: string[];
};

// Reference ranges for CBC
export const CBC_REFERENCE_RANGES: Record<keyof CBCParameters, ReferenceRange> = {
  hemoglobin: {
    unit: 'g/dL',
    male: { min: 13.5, max: 17.5 },
    female: { min: 12.0, max: 15.5 },
    description: 'Protein in red blood cells that carries oxygen'
  },
  redBloodCellCount: {
    unit: 'million/μL',
    male: { min: 4.5, max: 5.9 },
    female: { min: 4.0, max: 5.2 },
    description: 'Total number of red blood cells'
  },
  whiteBloodCellCount: {
    unit: 'cells/μL',
    common: { min: 4500, max: 11000 },
    description: 'Total number of white blood cells'
  },
  neutrophils: {
    unit: '%',
    common: { min: 40, max: 60 },
    description: 'Type of white blood cell'
  },
  lymphocytes: {
    unit: '%',
    common: { min: 20, max: 40 },
    description: 'Type of white blood cell'
  },
  monocytes: {
    unit: '%',
    common: { min: 2, max: 8 },
    description: 'Type of white blood cell'
  },
  eosinophils: {
    unit: '%',
    common: { min: 1, max: 4 },
    description: 'Type of white blood cell'
  },
  basophils: {
    unit: '%',
    common: { min: 0.5, max: 1 },
    description: 'Type of white blood cell'
  },
  absoluteNeutrophilCount: {
    unit: 'cells/μL',
    common: { min: 1800, max: 7800 },
    description: 'Absolute number of neutrophils'
  },
  absoluteLymphocyteCount: {
    unit: 'cells/μL',
    common: { min: 1000, max: 4800 },
    description: 'Absolute number of lymphocytes'
  },
  absoluteMonocyteCount: {
    unit: 'cells/μL',
    common: { min: 200, max: 950 },
    description: 'Absolute number of monocytes'
  },
  absoluteEosinophilCount: {
    unit: 'cells/μL',
    common: { min: 15, max: 500 },
    description: 'Absolute number of eosinophils'
  },
  absoluteBasophilCount: {
    unit: 'cells/μL',
    common: { min: 0, max: 200 },
    description: 'Absolute number of basophils'
  },
  plateletCount: {
    unit: '/μL',
    common: { min: 150000, max: 450000 },
    description: 'Number of platelets'
  },
  hematocrit: {
    unit: '%',
    male: { min: 41, max: 50 },
    female: { min: 36, max: 46 },
    description: 'Percentage of blood volume occupied by red blood cells'
  },
  mcv: {
    unit: 'fL',
    common: { min: 80, max: 100 },
    description: 'Average size of red blood cells'
  },
  mch: {
    unit: 'pg',
    common: { min: 27, max: 31 },
    description: 'Average amount of hemoglobin per red blood cell'
  },
  mchc: {
    unit: 'g/dL',
    common: { min: 32, max: 36 },
    description: 'Average concentration of hemoglobin in red blood cells'
  },
  rdw: {
    unit: '%',
    common: { min: 11.5, max: 14.5 },
    description: 'Measure of variation in red blood cell size'
  },
  mpv: {
    unit: 'fL',
    common: { min: 7.5, max: 11.5 },
    description: 'Average size of platelets'
  }
};

// Reference ranges for LFT
export const LFT_REFERENCE_RANGES: Record<keyof LFTParameters, ReferenceRange> = {
  alt: {
    unit: 'U/L',
    male: { min: 7, max: 55 },
    female: { min: 7, max: 45 },
    description: 'Enzyme found primarily in the liver'
  },
  ast: {
    unit: 'U/L',
    male: { min: 8, max: 48 },
    female: { min: 8, max: 43 },
    description: 'Enzyme found in the liver, heart, and muscles'
  },
  alp: {
    unit: 'U/L',
    common: { min: 44, max: 147 },
    description: 'Enzyme found in liver, bones, and placenta'
  },
  ggt: {
    unit: 'U/L',
    male: { min: 8, max: 61 },
    female: { min: 5, max: 36 },
    description: 'Enzyme found in liver, pancreas, and kidneys'
  },
  totalBilirubin: {
    unit: 'mg/dL',
    common: { min: 0.1, max: 1.2 },
    description: 'Breakdown product of hemoglobin'
  },
  directBilirubin: {
    unit: 'mg/dL',
    common: { min: 0.0, max: 0.3 },
    description: 'Bilirubin that has been processed by the liver'
  },
  indirectBilirubin: {
    unit: 'mg/dL',
    common: { min: 0.1, max: 0.9 },
    description: 'Bilirubin that has not been processed by the liver'
  },
  totalProtein: {
    unit: 'g/dL',
    common: { min: 6.0, max: 8.3 },
    description: 'Total amount of protein in blood'
  },
  albumin: {
    unit: 'g/dL',
    common: { min: 3.5, max: 5.0 },
    description: 'Major protein produced by the liver'
  },
  globulin: {
    unit: 'g/dL',
    common: { min: 2.0, max: 3.5 },
    description: 'Group of proteins in blood'
  },
  albuminGlobulinRatio: {
    unit: 'ratio',
    common: { min: 1.2, max: 2.5 },
    description: 'Ratio of albumin to globulin'
  },
  ldh: {
    unit: 'U/L',
    common: { min: 140, max: 280 },
    description: 'Enzyme found in many body tissues'
  }
};

// Reference ranges for KFT
export const KFT_REFERENCE_RANGES: Record<keyof KFTParameters, ReferenceRange> = {
  bloodUreaNitrogen: {
    unit: 'mg/dL',
    common: { min: 7, max: 20 },
    description: 'Waste product removed by kidneys'
  },
  serumCreatinine: {
    unit: 'mg/dL',
    male: { min: 0.7, max: 1.3 },
    female: { min: 0.6, max: 1.1 },
    description: 'Waste product from muscle metabolism'
  },
  egfr: {
    unit: 'mL/min/1.73m²',
    common: { min: 90, max: 200 },
    description: 'Measure of kidney function'
  },
  uricAcid: {
    unit: 'mg/dL',
    male: { min: 3.4, max: 7.0 },
    female: { min: 2.4, max: 6.0 },
    description: 'Waste product from purine metabolism'
  },
  bunCreatinineRatio: {
    unit: 'ratio',
    common: { min: 10, max: 20 },
    description: 'Ratio used to evaluate kidney function'
  },
  cystatinC: {
    unit: 'mg/L',
    common: { min: 0.5, max: 1.0 },
    description: 'Protein used to estimate GFR'
  }
};

// Reference ranges for Lipid
export const LIPID_REFERENCE_RANGES: Record<keyof LipidParameters, ReferenceRange> = {
  totalCholesterol: {
    unit: 'mg/dL',
    common: { min: 0, max: 200 },
    description: 'Total amount of cholesterol in blood'
  },
  hdlCholesterol: {
    unit: 'mg/dL',
    male: { min: 40, max: 100 },
    female: { min: 50, max: 100 },
    description: '"Good" cholesterol'
  },
  ldlCholesterol: {
    unit: 'mg/dL',
    common: { min: 0, max: 100 },
    description: '"Bad" cholesterol'
  },
  vldlCholesterol: {
    unit: 'mg/dL',
    common: { min: 0, max: 30 },
    description: 'Type of lipoprotein'
  },
  triglycerides: {
    unit: 'mg/dL',
    common: { min: 0, max: 150 },
    description: 'Type of fat in blood'
  },
  nonHdlCholesterol: {
    unit: 'mg/dL',
    common: { min: 0, max: 130 },
    description: 'Total cholesterol minus HDL'
  },
  totalCholesterolHdlRatio: {
    unit: 'ratio',
    common: { min: 0, max: 5.0 },
    description: 'Ratio used to assess heart disease risk'
  },
  ldlHdlRatio: {
    unit: 'ratio',
    common: { min: 0, max: 3.0 },
    description: 'Ratio used to assess heart disease risk'
  }
};

// Reference ranges for Thyroid
export const THYROID_REFERENCE_RANGES: Record<keyof ThyroidParameters, ReferenceRange> = {
  tsh: {
    unit: 'mIU/L',
    common: { min: 0.4, max: 4.0 },
    description: 'Pituitary hormone that stimulates thyroid'
  },
  freeT4: {
    unit: 'ng/dL',
    common: { min: 0.8, max: 1.8 },
    description: 'Active form of T4 hormone'
  },
  freeT3: {
    unit: 'pg/mL',
    common: { min: 2.3, max: 4.2 },
    description: 'Active form of T3 hormone'
  },
  totalT4: {
    unit: 'μg/dL',
    common: { min: 5.0, max: 12.0 },
    description: 'Total T4 (bound and unbound)'
  },
  totalT3: {
    unit: 'ng/dL',
    common: { min: 80, max: 200 },
    description: 'Total T3 (bound and unbound)'
  },
  tpoAntibodies: {
    unit: 'IU/mL',
    common: { min: 0, max: 35 },
    description: 'Antibodies against thyroid enzyme'
  },
  tgAntibodies: {
    unit: 'IU/mL',
    common: { min: 0, max: 20 },
    description: 'Antibodies against thyroglobulin'
  },
  tsi: {
    unit: '%',
    common: { min: 0, max: 140 },
    description: 'Antibodies that mimic TSH'
  },
  reverseT3: {
    unit: 'ng/dL',
    common: { min: 10, max: 24 },
    description: 'Inactive form of T3'
  }
};

// Reference ranges for Diabetes
export const DIABETES_REFERENCE_RANGES: Record<keyof DiabetesParameters, ReferenceRange> = {
  fastingBloodGlucose: {
    unit: 'mg/dL',
    common: { min: 70, max: 99 },
    description: 'Blood sugar after at least 8 hours of fasting'
  },
  randomBloodGlucose: {
    unit: 'mg/dL',
    common: { min: 0, max: 140 },
    description: 'Blood sugar without regard to time of last meal'
  },
  postprandialGlucose: {
    unit: 'mg/dL',
    common: { min: 0, max: 140 },
    description: 'Blood sugar 2 hours after eating'
  },
  ogtt: {
    unit: 'mg/dL',
    common: { min: 0, max: 140 },
    description: 'Blood sugar 2 hours after drinking glucose solution'
  },
  hba1c: {
    unit: '%',
    common: { min: 0, max: 5.7 },
    description: 'Average blood sugar over past 3 months'
  },
  fructosamine: {
    unit: 'μmol/L',
    common: { min: 200, max: 285 },
    description: 'Average blood sugar over past 2-3 weeks'
  },
  cPeptide: {
    unit: 'ng/mL',
    common: { min: 0.8, max: 3.9 },
    description: 'Byproduct of insulin production'
  },
  insulinLevel: {
    unit: 'μIU/mL',
    common: { min: 3, max: 25 },
    description: 'Hormone that regulates blood sugar'
  },
  homaIr: {
    unit: 'value',
    common: { min: 0, max: 3.0 },
    description: 'Insulin resistance calculation'
  }
};

// Reference ranges for Cardiac
export const CARDIAC_REFERENCE_RANGES: Record<keyof CardiacParameters, ReferenceRange> = {
  troponinI: {
    unit: 'ng/mL',
    common: { min: 0, max: 0.04 },
    description: 'Protein released during heart damage'
  },
  troponinT: {
    unit: 'ng/mL',
    common: { min: 0, max: 0.01 },
    description: 'Protein released during heart damage'
  },
  ck: {
    unit: 'U/L',
    male: { min: 39, max: 308 },
    female: { min: 26, max: 192 },
    description: 'Enzyme found in heart, brain, and muscles'
  },
  ckMb: {
    unit: 'ng/mL',
    common: { min: 0, max: 6.3 },
    description: 'Heart-specific form of CK'
  },
  ckMbIndex: {
    unit: '%',
    common: { min: 0, max: 3.0 },
    description: 'Percentage of total CK that is CK-MB'
  },
  myoglobin: {
    unit: 'ng/mL',
    male: { min: 28, max: 72 },
    female: { min: 25, max: 58 },
    description: 'Protein found in heart and muscle cells'
  },
  bnp: {
    unit: 'pg/mL',
    common: { min: 0, max: 100 },
    description: 'Hormone released when heart is stressed'
  },
  ntProBnp: {
    unit: 'pg/mL',
    common: { min: 0, max: 125 },
    description: 'Inactive form of BNP'
  },
  hsCrp: {
    unit: 'mg/L',
    common: { min: 0, max: 3.0 },
    description: 'Inflammatory marker'
  },
  homocysteine: {
    unit: 'μmol/L',
    common: { min: 5, max: 15 },
    description: 'Amino acid linked to heart disease'
  }
};

// Reference ranges for Electrolytes
export const ELECTROLYTES_REFERENCE_RANGES: Record<keyof ElectrolytesParameters, ReferenceRange> = {
  sodium: {
    unit: 'mEq/L',
    common: { min: 135, max: 145 },
    description: 'Electrolyte important for fluid balance'
  },
  potassium: {
    unit: 'mEq/L',
    common: { min: 3.5, max: 5.0 },
    description: 'Electrolyte important for heart function'
  },
  chloride: {
    unit: 'mEq/L',
    common: { min: 97, max: 107 },
    description: 'Electrolyte that maintains pH balance'
  },
  bicarbonate: {
    unit: 'mEq/L',
    common: { min: 22, max: 29 },
    description: 'Helps maintain acid-base balance'
  },
  calcium: {
    unit: 'mg/dL',
    common: { min: 8.5, max: 10.5 },
    description: 'Mineral important for bones and signaling'
  },
  ionizedCalcium: {
    unit: 'mg/dL',
    common: { min: 4.6, max: 5.3 },
    description: 'Biologically active form of calcium'
  },
  phosphorus: {
    unit: 'mg/dL',
    common: { min: 2.5, max: 4.5 },
    description: 'Mineral important for bones and energy'
  },
  magnesium: {
    unit: 'mg/dL',
    common: { min: 1.7, max: 2.2 },
    description: 'Mineral important for nerve and muscle function'
  }
};

// Reference ranges for Iron
export const IRON_REFERENCE_RANGES: Record<keyof IronParameters, ReferenceRange> = {
  serumIron: {
    unit: 'μg/dL',
    male: { min: 65, max: 175 },
    female: { min: 50, max: 170 },
    description: 'Amount of iron in blood'
  },
  tibc: {
    unit: 'μg/dL',
    common: { min: 250, max: 450 },
    description: "Measure of transferrin's iron-binding capacity"
  },
  transferrin: {
    unit: 'mg/dL',
    common: { min: 200, max: 360 },
    description: 'Protein that transports iron'
  },
  ferritin: {
    unit: 'ng/mL',
    male: { min: 20, max: 250 },
    female: { min: 10, max: 120 },
    description: 'Protein that stores iron'
  },
  transferrinSaturation: {
    unit: '%',
    common: { min: 20, max: 50 },
    description: 'Percentage of transferrin bound to iron'
  }
};

// Reference ranges for Coagulation
export const COAGULATION_REFERENCE_RANGES: Record<keyof CoagulationParameters, ReferenceRange> = {
  pt: {
    unit: 'seconds',
    common: { min: 11, max: 13.5 },
    description: 'Time for blood to clot (extrinsic pathway)'
  },
  inr: {
    unit: 'ratio',
    common: { min: 0.8, max: 1.1 },
    description: 'Standardized PT ratio'
  },
  ptt: {
    unit: 'seconds',
    common: { min: 25, max: 35 },
    description: 'Time for blood to clot (intrinsic pathway)'
  },
  aptt: {
    unit: 'seconds',
    common: { min: 25, max: 38 },
    description: 'Activated version of PTT'
  },
  bleedingTime: {
    unit: 'minutes',
    common: { min: 2, max: 9 },
    description: 'Time for small cut to stop bleeding'
  },
  clottingTime: {
    unit: 'minutes',
    common: { min: 8, max: 15 },
    description: 'Time for blood to clot in a tube'
  },
  dDimer: {
    unit: 'ng/mL',
    common: { min: 0, max: 500 },
    description: 'Breakdown product of blood clots'
  },
  fibrinogen: {
    unit: 'mg/dL',
    common: { min: 200, max: 400 },
    description: 'Protein involved in clotting'
  },
  thrombinTime: {
    unit: 'seconds',
    common: { min: 14, max: 16 },
    description: 'Time for thrombin to convert fibrinogen to fibrin'
  }
};

// Helper function to evaluate a lab result against reference ranges
export function evaluateLabValue(
  value: number,
  referenceRange: ReferenceRange,
  gender?: string
): LabResultFlag {
  // Determine which reference range to use based on gender
  let range: { min: number; max: number } | undefined;

  if (gender === 'Male' && referenceRange.male) {
    range = referenceRange.male;
  } else if (gender === 'Female' && referenceRange.female) {
    range = referenceRange.female;
  } else if (referenceRange.common) {
    range = referenceRange.common;
  }

  if (!range) {
    return 'normal'; // Default if no appropriate range is found
  }

  // Critical values (20% outside range)
  const criticalLowThreshold = range.min - (range.min * 0.2);
  const criticalHighThreshold = range.max + (range.max * 0.2);

  if (value < criticalLowThreshold) {
    return 'critical_low';
  } else if (value > criticalHighThreshold) {
    return 'critical_high';
  } else if (value < range.min) {
    return 'low';
  } else if (value > range.max) {
    return 'high';
  } else {
    return 'normal';
  }
}

// Get appropriate format string for a value
export function getFormattedValue(value: number, unit: string): string {
  // Apply appropriate formatting based on unit type
  if (unit.includes('%')) {
    // Percentages
    return value.toFixed(1);
  } else if (unit.includes('mg/dL') || unit.includes('g/dL') || unit.includes('μg/dL')) {
    // Common blood measurements
    return value.toFixed(1);
  } else if (unit.includes('/μL')) {
    // Cell counts - no decimal places
    return Math.round(value).toLocaleString();
  } else if (unit.includes('ratio')) {
    // Ratios - 2 decimal places
    return value.toFixed(2);
  } else {
    // Default formatting - 2 decimal places
    return value.toFixed(2);
  }
}

// Get text color based on result flag
export function getFlagColorClass(flag: LabResultFlag): string {
  switch (flag) {
    case 'critical_low':
      return 'text-red-700 font-bold';
    case 'critical_high':
      return 'text-red-700 font-bold';
    case 'low':
      return 'text-amber-600';
    case 'high':
      return 'text-amber-600';
    case 'normal':
    default:
      return 'text-gray-900';
  }
}

// Get background color based on result flag
export function getFlagBgClass(flag: LabResultFlag): string {
  switch (flag) {
    case 'critical_low':
    case 'critical_high':
      return 'bg-red-100 text-red-800';
    case 'low':
    case 'high':
      return 'bg-amber-100 text-amber-800';
    case 'normal':
    default:
      return 'bg-green-100 text-green-800';
  }
}

// Sample structure for all test findings
export type TestFindings = {
  cbc?: CBCParameters;
  lft?: LFTParameters;
  kft?: KFTParameters;
  lipid?: LipidParameters;
  thyroid?: ThyroidParameters;
  diabetes?: DiabetesParameters;
  cardiac?: CardiacParameters;
  electrolytes?: ElectrolytesParameters;
  iron?: IronParameters;
  coagulation?: CoagulationParameters;
  other?: Record<string, any>;
};